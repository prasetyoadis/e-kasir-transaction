// --- STATE MANAGEMENT ---
let productsData = []; // Pengganti dummyProducts, akan diisi via Fetch
let cart = []; // Array to hold cart items

// --- DOM ELEMENTS ---
const elements = {
    barcodeInput: document.getElementById("barcode_input"),
    qtyInput: document.getElementById("qty_input"),
    tableBody: document.getElementById("cart_table_body"),
    grandTotalDisplay: document.getElementById("display_grand_total"),
    subTotalVal: document.getElementById("val_sub_total"),
    discountVal: document.getElementById("val_discount"),
    grandTotalVal: document.getElementById("val_grand_total"),
    cashInput: document.getElementById("cash_input"),
    changeInput: document.getElementById("change_input"),
    customerSelect: document.getElementById("customer_select"),
};

// --- FORMATTER ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

// --- CORE FUNCTIONS ---

// 0. LOAD DATA (NEW FEATURE)
async function loadProducts() {
    try {
        // Path sesuai request (asumsi folder public adalah root server)
        const response = await fetch('/test-response/success/transaction-item/200-get-all-transaction-item.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        // Mapping data JSON ke format yang dikenali sistem (sku -> barcode, harga_jual -> price)
        if (json.result && json.result.data) {
            productsData = json.result.data.map(item => ({
                barcode: item.sku,       // Mapping SKU ke barcode
                name: item.name,
                price: item.harga_jual,  // Mapping harga_jual ke price
                stock: item.stock,       // Menyimpan data stok
                id: item.id
            }));
            console.log("Data loaded:", productsData.length, "items");
        }
    } catch (error) {
        console.error("Gagal memuat data produk:", error);
        alert("Error: Gagal mengambil data produk dari server.");
    }
}

// 1. Add Product Logic
function addProductFromInput() {
    const barcode = elements.barcodeInput.value.trim();
    const qty = parseInt(elements.qtyInput.value) || 1;

    if (!barcode) {
        alert("Please enter a barcode!");
        return;
    }

    // Cari produk di array productsData yang sudah di-fetch
    const product = productsData.find(
        (p) => p.barcode.toLowerCase() === barcode.toLowerCase(),
    );

    if (product) {
        // Validasi Stok (Opsional, berdasarkan data JSON)
        if (product.stock < qty) {
            alert(`Stok tidak cukup! Tersedia: ${product.stock}`);
            return;
        }

        // Check if item exists in cart
        const existingItemIndex = cart.findIndex(
            (item) => item.barcode === product.barcode,
        );

        if (existingItemIndex > -1) {
            // Update quantity if exists
            cart[existingItemIndex].qty += qty;
        } else {
            // Add new item
            cart.push({
                barcode: product.barcode,
                name: product.name,
                price: product.price,
                qty: qty,
                discount: 0,
            });
        }

        // Reset Inputs
        elements.barcodeInput.value = "";
        elements.qtyInput.value = 1;
        elements.barcodeInput.focus();

        renderTable();
    } else {
        alert("Product not found! (Try: SNJ-SBY-001)");
    }
}

// 2. Render Table
function renderTable() {
    elements.tableBody.innerHTML = "";

    if (cart.length === 0) {
        elements.tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-400">No items added yet.</td></tr>`;
        updateTotals();
        return;
    }

    cart.forEach((item, index) => {
        const total = item.price * item.qty - item.discount;

        const row = `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-center text-gray-600">${index + 1}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${item.barcode}</td>
                <td class="px-6 py-4 text-gray-800">${item.name}</td>
                <td class="px-6 py-4 text-right">${formatRupiah(item.price)}</td>
                <td class="px-6 py-4 text-center">${item.qty}</td>
                <td class="px-6 py-4 text-right text-red-500">${item.discount > 0 ? formatRupiah(item.discount) : "-"}</td>
                <td class="px-6 py-4 text-right font-bold text-gray-800">${formatRupiah(total)}</td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button onclick="updateItemQty(${index})" class="btn-edit" style="background:#eab30833; color:#b58900; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteItem(${index})" class="btn-delete" style="background:#c2433d33; color:#c2433d; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        elements.tableBody.innerHTML += row;
    });

    updateTotals();
}

// 3. Actions (Update & Delete)
window.updateItemQty = function (index) {
    const newQty = prompt("Enter new quantity:", cart[index].qty);
    if (newQty !== null && newQty > 0) {
        // Validasi stok ulang saat edit qty (Opsional)
        const product = productsData.find(p => p.barcode === cart[index].barcode);
        if(product && product.stock < newQty) {
             alert(`Stok tidak cukup! Tersedia: ${product.stock}`);
             return;
        }

        cart[index].qty = parseInt(newQty);
        renderTable();
    }
};

window.deleteItem = function (index) {
    if (confirm("Remove this item?")) {
        cart.splice(index, 1);
        renderTable();
    }
};

// 4. Calculate Totals
function updateTotals() {
    let subTotal = 0;
    let totalDiscount = 0;

    // Hitung total item
    cart.forEach((item) => {
        subTotal += item.price * item.qty;
        totalDiscount += item.discount;
    });

    // Cek diskon member
    const isMember = elements.customerSelect.value === "Member";
    if (isMember) {
        const memberDisc = subTotal * 0.05;
        totalDiscount += memberDisc;
    }

    const grandTotal = subTotal - totalDiscount;

    // Update UI View
    elements.subTotalVal.innerText = formatRupiah(subTotal);
    elements.discountVal.innerText = formatRupiah(totalDiscount);
    elements.grandTotalVal.innerText = formatRupiah(grandTotal);

    // Large display
    elements.grandTotalDisplay.innerText = formatRupiah(grandTotal)
        .replace("Rp", "")
        .trim();

    // Trigger hitung kembalian
    calculateChange(grandTotal);
}

// 5. Payment Logic
function calculateChange(currentGrandTotal = null) {
    const parseRupiah = (str) => {
        const num = parseFloat(str.replace(/[^\d]/g, ""));
        return isNaN(num) ? 0 : num;
    };

    let grandTotal = currentGrandTotal;
    if (grandTotal === null) {
        grandTotal = parseRupiah(elements.grandTotalVal.innerText);
    }

    const cash = parseFloat(elements.cashInput.value) || 0;
    const change = cash - grandTotal;

    if (cash >= grandTotal) {
        elements.changeInput.value = formatRupiah(change);
        elements.changeInput.style.color = "green";
    } else {
        elements.changeInput.value = "0";
        elements.changeInput.style.color = "red";
    }
}

// 6. PRINT RECEIPT
function printReceipt(cash, change, subTotal, discount, grandTotal) {
    const date = new Date();

    const elDate = document.getElementById("rec-date");
    if (elDate) elDate.innerText = date.toLocaleDateString("id-ID");

    const elTime = document.getElementById("rec-time");
    if (elTime) elTime.innerText = date.toLocaleTimeString("id-ID");

    const elInv = document.getElementById("rec-inv");
    if (elInv) elInv.innerText = `MP${Date.now().toString().slice(-6)}`;

    const container = document.getElementById("rec-items");
    if (container) {
        container.innerHTML = "";
        let totalQty = 0;

        cart.forEach((item) => {
            totalQty += item.qty;
            const totalItemPrice = item.price * item.qty;
            const html = `
                <div class="rec-item">
                    <span class="rec-item-name">${item.name}</span>
                    <div class="rec-item-calc">
                        <span>${item.qty} x ${item.price.toLocaleString("id-ID")}</span>
                        <span>${totalItemPrice.toLocaleString("id-ID")}</span>
                    </div>
                </div>`;
            container.innerHTML += html;
        });

        const elQty = document.getElementById("rec-total-qty");
        if (elQty) elQty.innerText = totalQty;
    }

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val.toLocaleString("id-ID");
    };

    setVal("rec-subtotal", subTotal);
    setVal("rec-discount", discount);
    setVal("rec-grand-total", grandTotal);
    setVal("rec-cash", cash);
    setVal("rec-change", change);

    const area = document.getElementById("receipt-area");
    if (area) {
        area.style.display = "block";
        setTimeout(() => {
            window.print();
            area.style.display = "none";
        }, 500);
    }
}

// 7. Process Buttons & Main Logic
window.resetCart = function () {
    if (confirm("Cancel transaction and reset cart?")) {
        cart = [];
        elements.cashInput.value = "";
        elements.changeInput.value = "Rp 0";
        renderTable();
    }
};

window.processPayment = function () {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const cash = parseFloat(elements.cashInput.value) || 0;
    const parseRupiah = (str) => parseFloat(str.replace(/[^\d]/g, "")) || 0;
    const grandTotal = parseRupiah(elements.grandTotalVal.innerText);
    const subTotal = parseRupiah(elements.subTotalVal.innerText);
    const discount = parseRupiah(elements.discountVal.innerText);

    if (cash < grandTotal) {
        alert("Uang tunai kurang!");
        return;
    }

    const change = cash - grandTotal;

    printReceipt(cash, change, subTotal, discount, grandTotal);

    setTimeout(() => {
        cart = [];
        elements.cashInput.value = "";
        elements.changeInput.value = "Rp 0";
        renderTable();
    }, 1500);
};

// --- EVENT LISTENERS ---
if (elements.cashInput) {
    elements.cashInput.addEventListener("keyup", () => calculateChange());
}
if (elements.customerSelect) {
    elements.customerSelect.addEventListener("change", () => updateTotals());
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Panggil fungsi fetch data saat halaman dimuat
    loadProducts();
    renderTable();
});

// --- MOBILE SIDEBAR TOGGLE ---
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".sidebar-overlay");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        const sb = document.getElementById("sidebar");
        const ov = document.querySelector(".sidebar-overlay");
        if (sb) sb.classList.remove("active");
        if (ov) ov.classList.remove("active");
    }
});
