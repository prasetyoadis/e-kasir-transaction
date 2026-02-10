@extends('layouts.main-dashboard')
@section('css')
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/kasir.css') }}">
@endsection
@section('content')
    <main class="main-content">
        <div class="content-scrollable">

            <div class="input-section">

                <div class="card">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" value="{{ date('Y-m-d') }}">
                    </div>
                    <div class="form-group">
                        <label>Kasir</label>
                        <input type="text" value="Administrator" readonly class="readonly">
                    </div>
                    <div class="form-group">
                        <label>Customer</label>
                        <select id="customer_select">
                            <option value="General">Umum</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>
                </div>

                <div class="card highlight-card">
                    <div class="form-group">
                        <label>Barcode / Product</label>
                        <div class="input-group">
                            <input type="text" id="barcode_input" placeholder="Scan or Search..." autofocus>
                            <button class="btn-search"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="row-group">
                        <div class="form-group qty-group">
                            <label>Qty</label>
                            <input type="number" id="qty_input" value="1" min="1">
                        </div>
                        <button onclick="handleScanBarcode()" class="btn-add">
                            <i class="fas fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>

                <div class="card invoice-card">
                    <div class="invoice-info">
                        <span class="label">Invoice</span>
                        <span id="order-num" class="value">MP{{ date('ymd') }}001</span>
                    </div>
                    <div class="grand-total-display">
                        <span class="label">Grand Total</span>
                        <span class="value" id="display_grand_total">0</span>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <table class="pos-table">
                    <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th>Barcode</th>
                            <th>Product Item</th>
                            <th class="text-right">Price</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Discount</th>
                            <th class="text-right">Total</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cart_table_body">
                    </tbody>
                </table>
            </div>
        </div>

        <footer class="payment-footer">
            <div class="footer-grid">

                <div class="footer-col totals-col">
                    <div class="row-between">
                        <span>Sub Total</span>
                        <span class="bold" id="val_sub_total">Rp 0</span>
                    </div>
                    <div class="row-between">
                        <span>Discount</span>
                        <span class="bold text-red" id="val_discount">Rp 0</span>
                    </div>
                    <div class="row-between grand-row">
                        <span>Grand Total</span>
                        <span class="bold text-blue" id="val_grand_total">Rp 0</span>
                    </div>
                </div>

                <div class="footer-col inputs-col">
                    <div class="input-row">
                        <label>Cash (Rp)</label>
                        <input type="number" id="cash_input" placeholder="0">
                    </div>
                    <div class="input-row">
                        <label>Change</label>
                        <input type="text" id="change_input" readonly value="Rp 0">
                    </div>
                </div>

                <div class="footer-col actions-col">
                    <textarea id="txn_note" placeholder="Optional note..."></textarea>
                    <div class="btn-group">
                        <button onclick="resetCart()" class="btn-cancel">
                            <i class="fas fa-sync-alt"></i> Cancel
                        </button>
                        <button onclick="processPayment()" class="btn-process">
                            <i class="fas fa-paper-plane"></i> Process
                        </button>
                    </div>
                </div>

            </div>
        </footer>

    </main>

    <div id="receipt-area" style="display: none;">
        <div class="receipt">
            <div class="receipt-header">
                <h2 class="shop-name">KASSIA RETAIL</h2>
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
@endsection
@section('js')
    {{-- <script src="{{ asset('js/dashboard/cashier/pos-logic.js') }}"></script> --}}
    <script src="{{ asset('js/dashboard/cashier/fetch-kasir-pos.js') }}"></script>

    <script>
        // Toggle Sidebar khusus Mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');

            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Auto close sidebar jika layar dibesarkan kembali ke desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('active');
                document.querySelector('.sidebar-overlay').classList.remove('active');
            }
        });
    </script>
@endsection
</body>

</html>
