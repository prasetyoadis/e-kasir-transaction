/* =========================================
   KASIR POS LOGIC (RETAIL/MINIMARKET)
   File: public/js/dashboard/cashier/pos-logic.js
   ========================================= */

// --- 1. CONFIG & STATE ---
const API_BASE_URL = "http://192.168.43.6:8003/api"; // Sesuaikan IP/Domain backend
const TOKEN = localStorage.getItem('token');

let cart = []; // Menampung item belanja
let productsCache = []; // (Opsional) Simpan data produk lokal untuk pencarian cepat

const authHeader = () => ({
    Authorization: `bearer ${TOKEN}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
});

// DOM Elements
const elements = {
    barcodeInput: document.getElementById("barcode_input"),
    qtyInput: document.getElementById("qty_input"),
    cartTable: document.getElementById("cart_table_body"),
    subTotalVal: document.getElementById("val_sub_total"),
    discountVal: document.getElementById("val_discount"),
    grandTotalVal: document.getElementById("val_grand_total"),
    cashInput: document.getElementById("cash_input"),
    changeInput: document.getElementById("change_input"),
    customerSelect: document.getElementById("customer_select"),
    btnAdd: document.querySelector(".btn-add"), // Pastikan tombol bayar punya class ini
    btnProcess: document.querySelector(".btn-process") // Pastikan tombol bayar punya class ini
};

// --- 2. HELPER FUNCTIONS ---
const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(num);
};

const parseRupiah = (str) => {
    return parseInt(str.replace(/[^0-9,-]+/g, "")) || 0;
};

// --- 3. CORE LOGIC: SEARCH & ADD ITEM ---

// Fungsi 1: Scan Barcode (Dipanggil saat Enter di input barcode)
async function handleScanBarcode(barcode) {
    if (!barcode) return;

    try {
        // A. Cek di keranjang dulu (untuk update Qty jika barang sama)
        const existingItem = cart.find(item => item.barcode === barcode);

        if (existingItem) {
            updateCartQty(existingItem.barcode, existingItem.qty + 1);
            clearInput();
            return;
        }

        // B. Jika belum ada, Fetch ke API
        const response = await fetch(`${API_BASE_URL}/transaction-items?search=${barcode}`, {
            headers: authHeader()
        });

        const jsonProduct = await response.json();
        // Sesuaikan dengan struktur JSON backend Anda (misal: result.data)
        const product = jsonProduct.result.data || result;

        if (response.ok && product) {
            if (product[0].stock > 0) {
                addToCart(product[0]);
            } else {
                alert(`Stok habis untuk ${product[0].name}!`);
            }
        } else {
            alert("Produk tidak ditemukan!");
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        alert("Gagal mengambil data produk.");
    } finally {
        clearInput();
    }
}

function addToCart(product) {
    const newItem = {
        id: product.id,
        barcode: product.sku,
        name: product.name,
        price: parseFloat(product.harga_jual),
        qty: 1,
        stock_max: product.stock // Simpan stok maksimal untuk validasi
    };

    cart.push(newItem);
    renderTable();
}

function clearInput() {
    elements.barcodeInput.value = "";
    elements.barcodeInput.focus();
}

// --- 4. CART MANAGEMENT & CALCULATION ---

function updateCartQty(barcode, newQty) {
    const item = cart.find(i => i.barcode === barcode);
    if (!item) return;

    if (newQty > item.stock_max) {
        alert("Stok tidak mencukupi!");
        return;
    }

    if (newQty <= 0) {
        // Hapus item jika qty 0
        cart = cart.filter(i => i.barcode !== barcode);
    } else {
        item.qty = newQty;
    }
    renderTable();
}

function renderTable() {
    elements.cartTable.innerHTML = "";

    cart.forEach((item, index) => {
        const totalItemPrice = item.price * item.qty;

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.barcode}</td>
                <td>${item.name}</td>
                <td>${formatRupiah(item.price)}</td>
                <td>
                    <input type="number" min="1" value="${item.qty}"
                           class="qty-control"
                           onchange="updateCartQty('${item.barcode}', this.value)">
                </td>
                <td>
                <td>${formatRupiah(totalItemPrice)}</td>
                <td>
                    <button onclick="updateCartQty('${item.barcode}', 0)" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        elements.cartTable.innerHTML += row;
    });

    calculateTotals();
}

function calculateTotals() {
    // 1. Hitung Subtotal
    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // 2. Hitung Diskon (Logika Member)
    let discount = 0;
    const customerType = elements.customerSelect.value;

    if (customerType === 'Member') {
        discount = subTotal * 0.05; // Contoh: Diskon 5% untuk member
    }

    // 3. Grand Total
    const grandTotal = subTotal - discount;

    // 4. Update UI
    elements.subTotalVal.innerText = formatRupiah(subTotal);
    elements.discountVal.innerText = formatRupiah(discount);
    elements.grandTotalVal.innerText = formatRupiah(grandTotal);

    // Hitung kembalian real-time jika sudah ada input uang
    calculateChange();
}

function calculateChange() {
    const grandTotal = parseRupiah(elements.grandTotalVal.innerText);
    const cash = parseFloat(elements.cashInput.value) || 0;

    const change = cash - grandTotal;

    // Tampilkan kembalian (jangan minus di UI)
    elements.changeInput.value = change >= 0 ? formatRupiah(change) : formatRupiah(0);

    // Visual cue: text merah jika kurang
    elements.changeInput.style.color = change < 0 ? 'red' : 'black';
}

// --- 5. TRANSACTION SUBMISSION (CHECKOUT) ---

async function processPayment() {
    // A. Validasi
    const grandTotal = parseRupiah(elements.grandTotalVal.innerText);
    const cash = parseFloat(elements.cashInput.value) || 0;
    const change = cash - grandTotal;

    if (cart.length === 0) return alert("Keranjang kosong!");
    if (cash < grandTotal) return alert("Uang tunai kurang!");

    if (!confirm("Proses transaksi ini?")) return;

    // C. Kirim ke API
    try {
        sendCartItems();

        // [STEP 5] Checkout Transaksi
        await checkoutTransaction();

        // Jika sukses semua:
        alert("Transaksi Berhasil!");
        printReceipt(cash, change, grandTotal);
        
        // Reset State
        cart = [];
        renderTable();
        
        // Buat Transaksi Baru untuk Customer Berikutnya
        initTransaction();
    } catch (error) {
        console.error(error);
        alert("Gagal memproses pembayaran: " + error.message);
    }
}

async function initTransaction() {
    try {
        console.log("Inisialisasi Transaksi Baru...");
        
        // 1. POST /api/transaction
        const resTrans = await fetch(`${API_BASE_URL}/transactions`, {
            method: "POST",
            headers: authHeader()
        });
        const jsonTrans = await resTrans.json();
        if (!resTrans.ok) throw new Error(jsonTrans.result?.errorMessage || "Gagal buat transaksi");
        const trans = jsonTrans.result.data;

        currentTransactionId = trans.id;
        console.log("Transaction ID created:", currentTransactionId);
        document.getElementById('order-num').textContent = `#${trans.order_num}`;
        // 2. POST /api/transaction/{id}/cart (Buat Cart Session)
        const resCart = await fetch(`${API_BASE_URL}/transactions/${currentTransactionId}/cart`, {
            method: "POST",
            headers: authHeader()
        });
        
        if (!resCart.ok) {
            console.warn("Gagal init cart (mungkin sudah ada), lanjut saja.");
        } else {
            console.log("Cart session initialized.");
        }

    } catch (error) {
        console.error("Error Init Transaction:", error);
        alert("Gagal inisialisasi transaksi. Cek koneksi server.");
    }
}

// [STEP 4] Bulk Insert Items (Dipanggil saat tombol Bayar ditekan)
async function sendCartItems() {
    if (!currentTransactionId) {
        throw new Error("Transaction ID tidak ditemukan. Refresh halaman.");
    }

    // Mapping format cart JS ke format yang diminta backend (sesuaikan key-nya)
    // Asumsi backend butuh: { items: [ { product_id: "...", quantity: 1, ... } ] }
    const payload = {
        items: cart.map(item => ({
            transaction_item_id: item.id,   // Pastikan ID produk sesuai
            quantity: item.qty,
        }))
    };

    console.log("Sending items to DB...", payload);

    const response = await fetch(`${API_BASE_URL}/transactions/${currentTransactionId}/cart/items`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.result?.errorMessage || "Gagal menyimpan item ke database");
    
    return json;
}

// [STEP 5] Checkout / Finalize (Dipanggil setelah insert item sukses)
async function checkoutTransaction(paymentData) {
    if (!currentTransactionId) throw new Error("No Transaction ID");

    const payload = {
        payment_method_id: "01KH3RDKR0B3T0472JJ7TVV9V4", // Atau ambil dari input select jika ada
    };

    console.log("Checking out...", payload);

    const response = await fetch(`${API_BASE_URL}/transactions/${currentTransactionId}/checkout`, {
        method: "POST", // Sesuai request (POST)
        headers: authHeader(),
        body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.result?.errorMessage || "Gagal checkout");

    return json;
}

// --- 6. PRINT RECEIPT (Struk) ---
function printReceipt(cash, change, total) {
    const dateEl = document.getElementById("receipt-date");
    if (dateEl) dateEl.innerText = new Date().toLocaleString("id-ID");
    const invEl = document.getElementById("receipt-inv");
    // Gunakan Transaction ID asli jika ada, atau fallback ke timestamp
    if (invEl) invEl.innerText = document.getElementById('order-num').innerText;

    const itemsContainer = document.getElementById("receipt-items");
    if (itemsContainer) {
        itemsContainer.innerHTML = "";
        cart.forEach((item) => {
            const itemTotal = item.price * item.qty;
            const html = `
                <div class="item">
                    <div class="item-name">${item.name}</div>
                    <div class="item-calc">
                        <span>${item.qty} x ${item.price.toLocaleString("id-ID")}</span>
                        <span class="item-total">${itemTotal.toLocaleString("id-ID")}</span>
                    </div>
                </div>`;
            itemsContainer.innerHTML += html;
        });
    }

    const subTotalEl = document.getElementById("receipt-subtotal");
    if (subTotalEl) subTotalEl.innerText = total.toLocaleString("id-ID");
    const grandTotalEl = document.getElementById("receipt-grand-total");
    if (grandTotalEl) grandTotalEl.innerText = total.toLocaleString("id-ID");
    const cashEl = document.getElementById("receipt-cash");
    if (cashEl) cashEl.innerText = cash.toLocaleString("id-ID");
    const changeEl = document.getElementById("receipt-change");
    if (changeEl) changeEl.innerText = change.toLocaleString("id-ID");

    const receiptArea = document.getElementById("receipt-area");
    if (receiptArea) {
        receiptArea.style.display = "block";
        setTimeout(() => {
            window.print();
            receiptArea.style.display = "none";
        }, 500);
    }
}

// --- 7. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    initTransaction();
    // Fokus ke barcode saat load
    elements.barcodeInput.focus();

    // Listener Scan Barcode (Enter key)
    elements.barcodeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleScanBarcode(e.target.value);
            console.log(e.target.value)
        }
    });

    elements.btnAdd.addEventListener("click", (e) => {
        e.preventDefault();
        handleScanBarcode(elements.barcodeInput.value);
        console.log(elements.barcodeInput.value)
    });

    // Listener Hitung Kembalian
    elements.cashInput.addEventListener("input", calculateChange);

    // Listener Ganti Customer (Update Diskon)
    elements.customerSelect.addEventListener("change", calculateTotals);

    // if(elements.btnProcess) {
    //     elements.btnProcess.addEventListener("click", (e) => {
    //         e.preventDefault();
    //         processPayment();
    //     });
    // }
});
