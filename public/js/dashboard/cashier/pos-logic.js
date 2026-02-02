// --- DUMMY DATA ---
const dummyProducts = [
    { barcode: 'A001', name: 'YukCoding Drink', price: 15000 },
    { barcode: 'A002', name: 'Susu Formula', price: 50000 },
    { barcode: 'A003', name: 'Permen Enak', price: 500 },
    { barcode: 'A004', name: 'Roti Tawar', price: 12000 },
    { barcode: 'A005', name: 'Kopi Bubuk', price: 25000 }
];

// --- STATE MANAGEMENT ---
let cart = []; // Array to hold cart items

// --- DOM ELEMENTS ---
const elements = {
    barcodeInput: document.getElementById('barcode_input'),
    qtyInput: document.getElementById('qty_input'),
    tableBody: document.getElementById('cart_table_body'),
    grandTotalDisplay: document.getElementById('display_grand_total'),
    subTotalVal: document.getElementById('val_sub_total'),
    discountVal: document.getElementById('val_discount'),
    grandTotalVal: document.getElementById('val_grand_total'),
    cashInput: document.getElementById('cash_input'),
    changeInput: document.getElementById('change_input'),
    customerSelect: document.getElementById('customer_select')
};

// --- FORMATTER ---
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// --- CORE FUNCTIONS ---

// 1. Add Product Logic
function addProductFromInput() {
    const barcode = elements.barcodeInput.value.trim();
    const qty = parseInt(elements.qtyInput.value) || 1;

    if (!barcode) {
        alert("Please enter a barcode!");
        return;
    }

    // Find product in dummy data
    const product = dummyProducts.find(p => p.barcode.toLowerCase() === barcode.toLowerCase());

    if (product) {
        // Check if item exists in cart
        const existingItemIndex = cart.findIndex(item => item.barcode === product.barcode);

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
                discount: 0 // Default discount per item
            });
        }

        // Reset Inputs
        elements.barcodeInput.value = '';
        elements.qtyInput.value = 1;
        elements.barcodeInput.focus();

        renderTable();
    } else {
        alert("Product not found! (Try: A001, A002, A003)");
    }
}

// 2. Render Table
function renderTable() {
    elements.tableBody.innerHTML = '';

    if (cart.length === 0) {
        elements.tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-400">No items added yet.</td></tr>`;
        updateTotals();
        return;
    }

    cart.forEach((item, index) => {
        const total = (item.price * item.qty) - item.discount;

        const row = `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-center text-gray-600">${index + 1}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${item.barcode}</td>
                <td class="px-6 py-4 text-gray-800">${item.name}</td>
                <td class="px-6 py-4 text-right">${formatRupiah(item.price)}</td>
                <td class="px-6 py-4 text-center">${item.qty}</td>
                <td class="px-6 py-4 text-right text-red-500">${item.discount > 0 ? formatRupiah(item.discount) : '-'}</td>
                <td class="px-6 py-4 text-right font-bold text-gray-800">${formatRupiah(total)}</td>
                <td class="px-6 py-4 text-center space-x-2">
                    <button onclick="updateItemQty(${index})" class="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-xs transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteItem(${index})" class="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs transition">
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
window.updateItemQty = function(index) {
    const newQty = prompt("Enter new quantity:", cart[index].qty);
    if (newQty !== null && newQty > 0) {
        cart[index].qty = parseInt(newQty);
        renderTable();
    }
};

window.deleteItem = function(index) {
    if(confirm("Remove this item?")) {
        cart.splice(index, 1);
        renderTable();
    }
};

// 4. Calculate Totals
function updateTotals() {
    let subTotal = 0;
    let totalDiscount = 0;

    // Hitung total item
    cart.forEach(item => {
        subTotal += (item.price * item.qty);
        totalDiscount += item.discount;
    });

    // Cek diskon member (Simulasi logika global discount)
    const isMember = elements.customerSelect.value === 'Member';
    if (isMember) {
        // Diskon member 5% dari subtotal
        const memberDisc = subTotal * 0.05;
        totalDiscount += memberDisc;
    }

    const grandTotal = subTotal - totalDiscount;

    // Update UI View
    elements.subTotalVal.innerText = formatRupiah(subTotal);
    elements.discountVal.innerText = formatRupiah(totalDiscount);
    elements.grandTotalVal.innerText = formatRupiah(grandTotal);

    // Large display
    elements.grandTotalDisplay.innerText = formatRupiah(grandTotal).replace('Rp', '').trim();

    // Trigger hitung kembalian jika ada cash
    calculateChange(grandTotal);
}

// 5. Payment Logic
function calculateChange(currentGrandTotal = null) {
    // Helper untuk unformat rupiah string kembali ke number
    const parseRupiah = (str) => {
        const num = parseFloat(str.replace(/[^\d]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    // Ambil Grand Total (dari variable atau DOM)
    let grandTotal = currentGrandTotal;
    if (grandTotal === null) {
        // Ambil dari text, buang 'Rp' dan titik
        grandTotal = parseRupiah(elements.grandTotalVal.innerText);
    }

    const cash = parseFloat(elements.cashInput.value) || 0;
    const change = cash - grandTotal;

    if (cash >= grandTotal) {
        elements.changeInput.value = formatRupiah(change);
        elements.changeInput.classList.remove('text-red-600');
        elements.changeInput.classList.add('text-green-600');
    } else {
        elements.changeInput.value = '0'; // Atau minus
        elements.changeInput.classList.add('text-red-600');
    }
}

// 6. Process Buttons
window.resetCart = function() {
    if(confirm("Cancel transaction and reset cart?")) {
        cart = [];
        elements.cashInput.value = '';
        elements.changeInput.value = '0';
        renderTable();
    }
};

window.processPayment = function() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const cash = parseFloat(elements.cashInput.value) || 0;
    const grandTotalString = elements.grandTotalVal.innerText;
    const grandTotal = parseFloat(grandTotalString.replace(/[^\d]/g, ''));

    if (cash < grandTotal) {
        alert("Insufficient cash!");
        return;
    }

    alert(`Payment Success!\n\nGrand Total: ${grandTotalString}\nCash: ${formatRupiah(cash)}\nChange: ${elements.changeInput.value}`);

    // Reset after success
    cart = [];
    elements.cashInput.value = '';
    elements.changeInput.value = '0';
    renderTable();
};

// --- EVENT LISTENERS ---
elements.cashInput.addEventListener('keyup', () => calculateChange());
elements.customerSelect.addEventListener('change', () => updateTotals()); // Recalculate if member changes

// Initialize
renderTable();


// --- MOBILE SIDEBAR TOGGLE ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Menutup sidebar jika layar di-resize kembali ke desktop (opsional, untuk kerapian)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.querySelector('.sidebar-overlay').classList.remove('active');
    }
});
