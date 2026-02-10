<nav class="main-header">

    <div class="header-left">
        <button class="btn-icon-header" id="btnSidebarToggle">
            <i class="fa-solid fa-bars"></i>
        </button>
    </div>

    <div class="header-center">
        <img src="{{ asset('asset/img/kassia-bg-trans.webp') }}" alt="Kassia Logo" class="header-logo-img">
    </div>

    <div class="header-right">

        <div class="notification-wrapper">
            <button class="btn-icon-header notification-btn" id="btnNotifToggle">
                <i class="fa-regular fa-bell"></i>
                <span class="notif-badge"></span> </button>

            <div class="notif-dropdown" id="notifDropdown">
                <div class="notif-header">
                    <h3>Notifikasi</h3>
                    <a href="#" class="mark-read">Tandai dibaca</a>
                </div>

                <div class="notif-list">
                    <div class="notif-item unread">
                        <div class="notif-icon bg-warning-light">
                            <i class="fa-solid fa-box-open text-warning"></i>
                        </div>
                        <div class="notif-content">
                            <p class="notif-text">Stok <strong>Kopi Susu Gula Aren</strong> menipis (sisa 3).</p>
                            <span class="notif-time">10 menit yang lalu</span>
                        </div>
                        <span class="dot-unread"></span>
                    </div>

                    <div class="notif-item unread">
                        <div class="notif-icon bg-success-light">
                            <i class="fa-solid fa-receipt text-success"></i>
                        </div>
                        <div class="notif-content">
                            <p class="notif-text">Order baru <strong>#INV-2024001</strong> diterima.</p>
                            <span class="notif-time">1 jam yang lalu</span>
                        </div>
                        <span class="dot-unread"></span>
                    </div>

                    <div class="notif-item">
                        <div class="notif-icon bg-info-light">
                            <i class="fa-solid fa-circle-info text-info"></i>
                        </div>
                        <div class="notif-content">
                            <p class="notif-text">Laporan harian kemarin sudah siap diunduh.</p>
                            <span class="notif-time">Kemarin, 08:00</span>
                        </div>
                    </div>
                </div>

                <div class="notif-footer">
                    <a href="#">Lihat Semua Notifikasi</a>
                </div>
            </div>
        </div>
        <div class="profile-wrapper">
            <div class="header-profile" id="btnProfileToggle">
                <div class="avatar-circle">
                    <i class="fa-regular fa-user"></i>
                </div>
                <div class="profile-info">
                    <span class="profile-name">Admin Kassia</span>
                    <span class="profile-role">Super Admin</span>
                </div>
                <i class="fa-solid fa-ellipsis-vertical profile-kebab-icon"></i>
            </div>

            <div class="profile-dropdown" id="profileDropdown">
                <div class="profile-menu-header">
                    <p class="pm-name">Admin Kassia</p>
                    <p class="pm-email">admin@kassia.com</p>
                </div>
                <ul class="profile-menu-list">
                    <li>
                        <a href="#">
                            <i class="fa-regular fa-user"></i> Edit Profil
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa-solid fa-gear"></i> Pengaturan
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" class="text-danger">
                            <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</nav>
