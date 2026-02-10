<div class="sidebar-overlay" id="sidebarOverlay"></div>

<aside class="popup-sidebar" id="mainSidebar">

    <div class="sidebar-header">
        <div class="brand-wrapper">
            <img src="{{ asset('asset/img/kassia-logo-transparent.webp') }}" alt="Kassia">
            <span>KASSIA</span>
        </div>
        <button class="btn-close-sidebar">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <ul class="sidebar-menu">

        <li class="menu-category">Main</li>
        <li>
            <a href="http://127.0.0.1:8001/dashboard" class="nav-link {{ Request::is('dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-gauge-high"></i> Dashboard
            </a>
        </li>

        <li class="menu-category">Inventory & Product</li>
        <li>
            <a href="http://127.0.0.1:8002/dashboard/inventories"
                class="nav-link {{ Request::is('dashboard/inventories*') ? 'active' : '' }}">
                <i class="fa-solid fa-boxes-stacked"></i> Stock Overview
            </a>
        </li>
        <li>
            <a href="http://127.0.0.1:8002/dashboard/categories" class="nav-link {{ Request::is('dashboard/categories*') ? 'active' : '' }}">
                <i class="fa-solid fa-tags"></i> Manajemen Kategori
            </a>
        </li>
        <li>
            <a href="http://127.0.0.1:8002/dashboard/products" class="nav-link {{ Request::is('dashboard/products*') ? 'active' : '' }}">
                <i class="fa-solid fa-box-open"></i> Daftar Produk
            </a>
        </li>

        <li class="menu-category">Transaction</li>

        <li>
            <a href="http://127.0.0.1:8003/dashboard/kasir-cafe" class="nav-link {{ Request::is('dashboard/kasir-cafe*') ? 'active' : '' }}">
                <i class="fa-solid fa-mug-hot"></i> Kasir Cafe
            </a>
        </li>

        <li>
            <a href="http://127.0.0.1:8003/dashboard/kasir"
                class="nav-link {{ Request::is('dashboard/kasir') || Request::is('dashboard/kasir/*') ? 'active' : '' }}">
                <i class="fa-solid fa-cash-register"></i> Kasir POS (Retail)
            </a>
        </li>
    </ul>

</aside>
