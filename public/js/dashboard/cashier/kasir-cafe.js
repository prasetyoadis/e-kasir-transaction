/* ========================
   1. DUMMY DATA (CONFIG)
   ======================== */
const categories = {
    food: [
        { id: 'nasgor', name: 'Spesial Nasi Goreng' },
        { id: 'magelangan', name: 'Spesial Magelangan' },
        { id: 'ayam', name: 'Spesial Ayam' },
        { id: 'snack', name: 'Snack' }
    ],
    drink: [
        { id: 'tea', name: 'Es Teh' },
        { id: 'coffee', name: 'Kopi' },
        { id: 'milk', name: 'Susu' }
    ]
};

const menuItems = [
    { id: 1, category: 'nasgor', name: 'Nasgor Biasa', price: 10000, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=200' },
    { id: 2, category: 'nasgor', name: 'Nasgor Ati', price: 13000, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200' },
    { id: 3, category: 'nasgor', name: 'Nasgor Ayam', price: 13000, img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200' },
    { id: 4, category: 'nasgor', name: 'Nasgor Sosis', price: 12000, img: 'https://images.unsplash.com/photo-1626804475297-411dbe63c4eb?w=200' },
    { id: 5, category: 'nasgor', name: 'Nasgor Bakso', price: 13000, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200' },
    { id: 6, category: 'magelangan', name: 'Magelangan Jawa', price: 15000, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
    { id: 7, category: 'ayam', name: 'Ayam Geprek', price: 18000, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200' },
    { id: 8, category: 'tea', name: 'Es Teh Manis', price: 5000, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200' },
    { id: 9, category: 'coffee', name: 'Kopi Hitam', price: 6000, img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200' },
    { id: 10, category: 'coffee', name: 'Kopi Susu', price: 8000, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200' },
];

let cart = [];
let currentFilter = 'all';

/* ========================
   2. INITIALIZATION
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    renderMenu(menuItems);
    setupEventListeners();
    updateDate();
});

/* ========================
   3. CORE FUNCTIONS
   ======================== */

// Setup Tanggal Header
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID', options);
}

// Render Kategori Sidebar
function initCategories() {
    const foodList = document.getElementById('food-categories');
    const drinkList = document.getElementById('drink-categories');

    // Helper render
    const createLi = (cat) => {
        const li = document.createElement('li');
        li.innerText = cat.name;
        li.onclick = () => filterMenu(cat.id, li);
        return li;
    };

    categories.food.forEach(c => foodList.appendChild(createLi(c)));
    categories.drink.forEach(c => drinkList.appendChild(createLi(c)));

    // Tombol "Semua" manual di atas
    const allLi = document.createElement('li');
    allLi.innerText = 'Semua Menu';
    allLi.classList.add('active'); // Default active
    allLi.onclick = () => filterMenu('all', allLi);
    foodList.insertBefore(allLi, foodList.firstChild);
}

// Render Grid Menu
function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.onclick = () => addToCart(item);

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <div class="price">Rp ${item.price.toLocaleString('id-ID')}</div>
        `;
        grid.appendChild(card);
    });
}

// Filter Logic
function filterMenu(categoryId, element) {
    currentFilter = categoryId;

    // Update UI active class
    document.querySelectorAll('.sidebar-category li').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Filter Data
    if (categoryId === 'all') {
        renderMenu(menuItems);
    } else {
        const filtered = menuItems.filter(item => item.category === categoryId);
        renderMenu(filtered);
    }
}

// Search Logic
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = menuItems.filter(item => item.name.toLowerCase().includes(keyword));
        renderMenu(filtered);
    });

    // Cash Payment Calculation
    document.getElementById('cash-received').addEventListener('input', calculateChange);
}

/* ========================
   4. CART / ORDER LOGIC
   ======================== */

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
}

function renderCart() {
    const list = document.getElementById('order-list');
    list.innerHTML = '';

    let totalQty = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        list.innerHTML = `<li class="empty-state" style="text-align:center; color:#999; padding:20px;">Belum ada pesanan</li>`;
    } else {
        cart.forEach(item => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;

            const li = document.createElement('li');
            li.className = 'order-item';
            li.innerHTML = `
                <img src="${item.img}" alt="img">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="item-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
                <div class="item-actions">
                    <div class="qty-control">
                        <button class="btn-qty" onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn-qty" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn-delete" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    document.getElementById('total-items').innerText = totalQty;
    document.getElementById('total-price').innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
}

/* ========================
   5. MODAL PAYMENT LOGIC
   ======================== */

function openPaymentModal() {
    if (cart.length === 0) {
        alert('Keranjang pesanan kosong!');
        return;
    }
    const modal = document.getElementById('paymentModal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('modal-total').innerText = 'Rp ' + total.toLocaleString('id-ID');
    document.getElementById('cash-received').value = '';
    document.getElementById('change-amount').innerText = 'Rp 0';

    modal.style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function calculateChange() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const received = parseFloat(document.getElementById('cash-received').value) || 0;
    const change = received - total;

    const el = document.getElementById('change-amount');
    if (change >= 0) {
        el.innerText = 'Rp ' + change.toLocaleString('id-ID');
        el.style.color = 'var(--color-leaf-green)';
    } else {
        el.innerText = 'Kurang: Rp ' + Math.abs(change).toLocaleString('id-ID');
        el.style.color = 'var(--color-clay-red)';
    }
}

function processOrder() {
    alert('Order Berhasil Diproses & Struk Dicetak!');
    cart = [];
    renderCart();
    closePaymentModal();
    document.getElementById('customerName').value = '';
}

// Tutup modal jika klik di luar
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target == modal) {
        closePaymentModal();
    }
}
