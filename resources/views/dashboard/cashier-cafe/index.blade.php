<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanssia POS</title>
    <link rel="stylesheet" href="{{ asset('css/kasir-cafe.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>

    <div class="pos-container">

        <header class="pos-header">
            <div class="brand">
                <div class="logo">K</div>
                <div class="brand-info">
                    <h1>Kassia</h1>
                    <span id="current-date">Sabtu, 7 Januari 2024</span>
                </div>
            </div>

            <div class="header-center">
                <img src="/asset/img/kassia-bg-trans.webp" alt="Center Logo" class="center-logo"
                    onerror="this.style.display='none'">
            </div>

            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search menu...">
            </div>
        </header>

        <main class="pos-content">

            <aside class="sidebar-category">
                <div class="category-group">
                    <h3><i class="fas fa-utensils"></i> MAKANAN</h3>
                    <ul id="food-categories"></ul>
                </div>
                <div class="category-group">
                    <h3><i class="fas fa-coffee"></i> MINUMAN</h3>
                    <ul id="drink-categories"></ul>
                </div>
            </aside>

            <section class="menu-grid-container">
                <div id="menu-grid" class="menu-grid"></div>
            </section>

            <aside class="order-panel">
                <div class="order-header">
                    <h2>Order Menu</h2>
                    <span class="order-no">Order No. #New</span>
                    <button class="btn-icon-sm" style="border:none; background:none; cursor:pointer; color:#888;">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>

                <div class="customer-input">
                    <input type="text" id="customerName" placeholder="Nama Pelanggan (Optional)">
                </div>

                <div class="order-list-container">
                    <ul id="order-list" class="order-list">
                        <li class="empty-state" style="text-align: center; color: #999; margin-top: 20px;">
                            Belum ada pesanan
                        </li>
                    </ul>
                </div>

                <div class="order-summary">
                    <div class="summary-row">
                        <span>Total Items</span>
                        <span id="total-items">0</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span id="total-price">Rp 0</span>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-reset" onclick="resetOrder()">
                            <i class="fas fa-trash-alt"></i>
                        </button>

                        <button class="btn-order" onclick="openPaymentModal()">Order</button>
                    </div>
                </div>
            </aside>
        </main>
    </div>

    <div id="paymentModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Konfirmasi Pembayaran</h2>
                <span class="close" onclick="closePaymentModal()"
                    style="font-size:24px; cursor:pointer;">&times;</span>
            </div>
            <div class="modal-body">
                <div class="payment-summary" style="margin-bottom:20px;">
                    <p style="font-size:1.1rem;">Total Tagihan: <strong id="modal-total" class="text-gold">Rp 0</strong>
                    </p>
                </div>

                <div class="payment-methods">
                    <button class="method-btn active">Tunai</button>
                    <button class="method-btn">QRIS</button>
                    <button class="method-btn">Debit</button>
                </div>

                <div class="form-group">
                    <label>Uang Diterima</label>
                    <input type="number" id="cash-received" class="input-lg" placeholder="Rp ...">
                </div>

                <div class="form-group">
                    <label>Kembalian</label>
                    <div id="change-amount" class="text-lg">Rp 0</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closePaymentModal()">Batal</button>
                <button class="btn-confirm" onclick="processOrder()">Bayar & Cetak</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/dashboard/cashier/kasir-cafe.js') }}"></script>

    <div id="receipt-area" style="display: none;">
        <div class="receipt">
            <div class="receipt-header">
                <h2 class="shop-name">KASSIA CAFE</h2>
                <p style="font-size:10px; margin-bottom:5px;">Jl. Kopi Nikmat No. 1<br>Jakarta Selatan</p>
            </div>
            <div class="dashed-line">--------------------------------</div>
            <div class="receipt-meta">
                <div class="meta-row">
                    <span id="receipt-date"></span>
                    <span id="receipt-inv"></span>
                </div>
                <div class="meta-row">
                    <span>Kasir: Admin</span>
                    <span>Umum</span>
                </div>
            </div>
            <div class="dashed-line">--------------------------------</div>
            <div id="receipt-items"></div>
            <div class="dashed-line">--------------------------------</div>
            <div class="receipt-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="receipt-subtotal">0</span>
                </div>
                <div class="summary-row total-row">
                    <span>TOTAL</span>
                    <span id="receipt-grand-total">0</span>
                </div>
                <br>
                <div class="summary-row">
                    <span>Tunai</span>
                    <span id="receipt-cash">0</span>
                </div>
                <div class="summary-row">
                    <span>Kembali</span>
                    <span id="receipt-change">0</span>
                </div>
            </div>
            <div class="dashed-line">--------------------------------</div>
            <div class="receipt-footer">
                <p>Terima Kasih!</p>
                <p>Powered by Kassia</p>
            </div>
        </div>
    </div>

</body>

</html>
