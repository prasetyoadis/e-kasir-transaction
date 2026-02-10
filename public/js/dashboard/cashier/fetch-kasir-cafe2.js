/* ========================
   GLOBAL VARIABLES
   ======================== */
let menuItems = [];
let cart = [];
let currentFilter = "all";
let currentTransactionId = null; // Variable untuk menyimpan ID Transaksi Aktif

// Ganti Base URL sesuai server backend Anda
const BASE_API_URL = "http://192.168.43.6:8003/api"; 
const TOKEN = localStorage.getItem("token");

const authHeader = () => ({
    Authorization: `bearer ${TOKEN}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
});

/* ========================
   1. INITIALIZATION
   ======================== */
document.addEventListener("DOMContentLoaded", () => {
    fetchMenuData();       // Step 1: Load Produk
    initTransaction();     // Step 2 & 3: Buat Transaksi & Cart Baru
    setupEventListeners();
    updateDate();
});

/* ========================
   API FUNCTIONS (STEP 2 - 5)
   ======================== */

// [STEP 2 & 3] Buat Transaksi Baru & Init Cart saat load halaman
async function initTransaction() {
    try {
        console.log("Inisialisasi Transaksi Baru...");
        
        // 1. POST /api/transaction
        const resTrans = await fetch(`${BASE_API_URL}/transactions`, {
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
        const resCart = await fetch(`${BASE_API_URL}/transactions/${currentTransactionId}/cart`, {
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

    const response = await fetch(`${BASE_API_URL}/transactions/${currentTransactionId}/cart/items`, {
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

    const response = await fetch(`${BASE_API_URL}/transactions/${currentTransactionId}/checkout`, {
        method: "POST", // Sesuai request (POST)
        headers: authHeader(),
        body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.result?.errorMessage || "Gagal checkout");

    return json;
}

/* ========================
   EXISTING FETCH MENU (STEP 1)
   ======================== */
async function fetchMenuData() {
    try {
        // Menggunakan BASE_API_URL
        const response = await fetch(`${BASE_API_URL}/transaction-items`, {
            method: "GET",
            headers: authHeader(),
        });

        const json = await response.json();
        if (json.statusCode >= 400 || Number(json.result.errorCode) >= 40) {
            throw new Error(json.result.errorMessage);
        }

        const rawData = json.result.data;

        menuItems = rawData.map((item) => {
            let itemCategories = [...item.categories];
            if (itemCategories.includes("Minuman")) {
                const otherTags = itemCategories.filter((c) => c !== "Minuman");
                if (otherTags.length === 0) itemCategories.push("Aneka Minuman");
            }
            return {
                id: item.id,
                sku: item.sku,
                name: item.name,
                price: item.harga_jual,
                stock: item.stock,
                categories: itemCategories,
                img: item.image.url,
                alt: item.image.alt,
            };
        });

        initDynamicCategories();
        renderMenu(menuItems);
    } catch (error) {
        console.error("Gagal memuat data menu:", error);
        const grid = document.getElementById("menu-grid");
        if (grid) grid.innerHTML = `<p style="text-align:center;color:red">Gagal Load Menu: ${error.message}</p>`;
    }
}

/* ========================
   UI & LOGIC LAINNYA (SAMA SEPERTI SEBELUMNYA)
   ======================== */
function updateDate() {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const dateEl = document.getElementById("current-date");
    if (dateEl) dateEl.innerText = new Date().toLocaleDateString("id-ID", options);
}

function initDynamicCategories() {
    const foodList = document.getElementById("food-categories");
    const drinkList = document.getElementById("drink-categories");
    if (!foodList || !drinkList) return;

    const foodTags = new Set();
    const drinkTags = new Set();

    menuItems.forEach((item) => {
        const isFood = item.categories.includes("Makanan") || item.categories.includes("Snack");
        const isDrink = item.categories.includes("Minuman");
        item.categories.forEach((cat) => {
            const blacklist = ["Makanan", "Minuman", "Tambahan"];
            if (!blacklist.includes(cat)) {
                if (isFood) foodTags.add(cat);
                if (isDrink) drinkTags.add(cat);
            }
            if (cat === "Snack") foodTags.add("Snack");
        });
    });

    const createLi = (tagName) => {
        const li = document.createElement("li");
        li.innerText = tagName;
        li.onclick = () => filterMenu(tagName, li);
        return li;
    };

    foodList.innerHTML = "";
    drinkList.innerHTML = "";
    const allLi = document.createElement("li");
    allLi.innerText = "Semua Menu";
    allLi.classList.add("active");
    allLi.onclick = () => filterMenu("all", allLi);
    foodList.appendChild(allLi);

    foodTags.forEach((tag) => foodList.appendChild(createLi(tag)));
    drinkTags.forEach((tag) => drinkList.appendChild(createLi(tag)));
}

function renderMenu(items) {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#888;">Menu tidak ditemukan.</p>`;
        return;
    }

    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "menu-card";
        if (item.stock > 0) {
            card.onclick = () => addToCart(item);
        } else {
            card.style.opacity = "0.6";
            card.style.cursor = "not-allowed";
        }
        const imgPath = item.img || "/asset/img/products/no_image.jpg";
        card.innerHTML = `
            <div style="position:relative;">
                <img src="${imgPath}" alt="${item.name}" onerror="this.src='/asset/img/products/no_image.jpg'">
                ${item.stock === 0 ? '<span style="position:absolute; top:0; right:0; background:red; color:white; padding:2px 6px; font-size:10px; border-radius:4px;">Habis</span>' : ""}
            </div>
            <h4>${item.name}</h4>
            <div class="price">Rp ${item.price.toLocaleString("id-ID")}</div>
        `;
        grid.appendChild(card);
    });
}

function filterMenu(categoryTag, element) {
    currentFilter = categoryTag;
    document.querySelectorAll(".sidebar-category li").forEach((el) => el.classList.remove("active"));
    if (element) element.classList.add("active");
    if (categoryTag === "all") {
        renderMenu(menuItems);
    } else {
        const filtered = menuItems.filter((item) => item.categories.includes(categoryTag));
        renderMenu(filtered);
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = menuItems.filter((item) => item.name.toLowerCase().includes(keyword));
            renderMenu(filtered);
        });
    }
    const cashInput = document.getElementById("cash-received");
    if (cashInput) {
        cashInput.addEventListener("input", calculateChange);
    }
}

function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQty = existingItem ? existingItem.qty : 0;
    if (currentQty + 1 > product.stock) {
        alert("Stok tidak mencukupi!");
        return;
    }
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

function updateQty(id, change) {
    const item = cart.find((i) => i.id === id);
    const originalProduct = menuItems.find((p) => p.id === id);
    if (item) {
        const newQty = item.qty + change;
        if (change > 0 && originalProduct && newQty > originalProduct.stock) {
            alert("Mencapai batas stok tersedia.");
            return;
        }
        item.qty = newQty;
        if (item.qty <= 0) {
            cart = cart.filter((i) => i.id !== id);
        }
    }
    renderCart();
}

function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    renderCart();
}

function resetOrder() {
    if (cart.length === 0) return;
    if (confirm("Hapus semua pesanan?")) {
        cart = [];
        renderCart();
    }
}

function renderCart() {
    const list = document.getElementById("order-list");
    if (!list) return;
    list.innerHTML = "";
    let totalQty = 0;
    let totalPrice = 0;
    if (cart.length === 0) {
        list.innerHTML = `<li class="empty-state" style="text-align:center; color:#999; padding:20px;">Belum ada pesanan</li>`;
    } else {
        cart.forEach((item) => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;
            const imgPath = item.img || "/asset/img/products/no_image.jpg";
            const li = document.createElement("li");
            li.className = "order-item";
            li.innerHTML = `
                <img src="${imgPath}" alt="img" onerror="this.src='/asset/img/products/no_image.jpg'">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="item-price">Rp ${item.price.toLocaleString("id-ID")}</span>
                </div>
                <div class="item-actions">
                    <div class="qty-control">
                        <button class="btn-qty" onclick="updateQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn-qty" onclick="updateQty('${item.id}', 1)">+</button>
                    </div>
                    <button class="btn-delete" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.appendChild(li);
        });
    }
    const totalItemsEl = document.getElementById("total-items");
    const totalPriceEl = document.getElementById("total-price");
    if (totalItemsEl) totalItemsEl.innerText = totalQty;
    if (totalPriceEl) totalPriceEl.innerText = "Rp " + totalPrice.toLocaleString("id-ID");
}

function openPaymentModal() {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }
    const modal = document.getElementById("paymentModal");
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById("modal-total").innerText = "Rp " + total.toLocaleString("id-ID");
    document.getElementById("cash-received").value = "";
    document.getElementById("change-amount").innerText = "Rp 0";
    if (modal) modal.style.display = "flex";
}

function closePaymentModal() {
    const modal = document.getElementById("paymentModal");
    if (modal) modal.style.display = "none";
}

function calculateChange() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const received = parseFloat(document.getElementById("cash-received").value) || 0;
    const change = received - total;
    const el = document.getElementById("change-amount");
    if (change >= 0) {
        el.innerText = "Rp " + change.toLocaleString("id-ID");
        el.style.color = "var(--color-leaf-green)";
    } else {
        el.innerText = "Kurang: Rp " + Math.abs(change).toLocaleString("id-ID");
        el.style.color = "var(--color-clay-red)";
    }
}

/* ========================
   MODIFIED PROCESS ORDER
   Step 4 & 5 Integration
   ======================== */
async function processOrder() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const received = parseFloat(document.getElementById("cash-received").value) || 0;

    if (received < total) {
        alert("Uang tunai kurang!");
        return;
    }

    const change = received - total;

    // Loading State sederhana (bisa dipercantik)
    const btnBayar = document.querySelector(".btn-confirm-pay"); // Pastikan class tombol di HTML sesuai
    if(btnBayar) btnBayar.innerText = "Memproses...";
    if(btnBayar) btnBayar.disabled = true;

    try {
        // [STEP 4] Simpan item ke DB
        await sendCartItems();

        // [STEP 5] Checkout Transaksi
        await checkoutTransaction({
            total: total,
            received: received,
            change: change
        });

        // Jika sukses semua:
        alert("Transaksi Berhasil!");
        printReceipt(received, change, total);
        
        // Reset State
        cart = [];
        renderCart();
        closePaymentModal();
        
        // Buat Transaksi Baru untuk Customer Berikutnya
        initTransaction();

    } catch (error) {
        console.error("Transaksi Gagal:", error);
        alert("Gagal memproses pesanan: " + error.message);
    } finally {
        if(btnBayar) btnBayar.innerText = "Bayar & Cetak Struk";
        if(btnBayar) btnBayar.disabled = false;
    }
}

function printReceipt(cash, change, total) {
    const dateEl = document.getElementById("receipt-date");
    if (dateEl) dateEl.innerText = new Date().toLocaleString("id-ID");
    const invEl = document.getElementById("receipt-inv");
    // Gunakan Transaction ID asli jika ada, atau fallback ke timestamp
    if (invEl) invEl.innerText = currentTransactionId ? `TRX-${currentTransactionId.substring(0,8)}` : `INV-${Date.now().toString().slice(-6)}`;

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

window.onclick = function (event) {
    const modal = document.getElementById("paymentModal");
    if (event.target == modal) closePaymentModal();
};