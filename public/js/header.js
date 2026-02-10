document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. DEFINISI ELEMENT (SELEKTOR)
    // ==========================================

    // Sidebar Elements
    const btnSidebarToggle = document.getElementById("btnSidebarToggle"); // Tombol Hamburger di Header
    const sidebar = document.getElementById("mainSidebar"); // Sidebar Wrapper
    const overlay = document.getElementById("sidebarOverlay"); // Layar Hitam

    // Note: btnCloseSidebar menggunakan class karena berada di dalam include navbar
    const btnCloseSidebar = document.querySelector(".btn-close-sidebar");

    // Notification Elements
    const btnNotif = document.getElementById("btnNotifToggle");
    const dropdownNotif = document.getElementById("notifDropdown");
    const badge = document.querySelector(".notif-badge");
    const btnMarkRead = document.querySelector(".mark-read");

    // Profile Elements
    const btnProfile = document.getElementById("btnProfileToggle");
    const dropdownProfile = document.getElementById("profileDropdown");

    // ==========================================
    // 2. LOGIKA SIDEBAR (CENTRALIZED)
    // ==========================================

    // Fungsi satu pintu untuk toggle class 'active'
    function toggleSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        }
    }

    // A. Event Buka (Klik Hamburger)
    if (btnSidebarToggle) {
        btnSidebarToggle.addEventListener("click", function (e) {
            e.stopPropagation(); // Mencegah event bubbling ke window
            toggleSidebar();
        });
    }

    // B. Event Tutup (Klik Tombol X di Sidebar)
    if (btnCloseSidebar) {
        btnCloseSidebar.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // C. Event Tutup (Klik Overlay / Layar Hitam)
    if (overlay) {
        overlay.addEventListener("click", function () {
            toggleSidebar();
        });
    }

    // ==========================================
    // 3. LOGIKA DROPDOWN (Notifikasi & Profil)
    // ==========================================

    // Toggle Notifikasi
    if (btnNotif && dropdownNotif) {
        btnNotif.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdownNotif.classList.toggle("active");
            // Tutup profil jika sedang terbuka agar tidak tumpang tindih
            if (dropdownProfile) dropdownProfile.classList.remove("active");
        });
    }

    // Toggle Profil
    if (btnProfile && dropdownProfile) {
        btnProfile.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdownProfile.classList.toggle("active");
            // Tutup notifikasi jika sedang terbuka
            if (dropdownNotif) dropdownNotif.classList.remove("active");
        });
    }

    // ==========================================
    // 4. GLOBAL CLICK EVENT (Tutup saat klik di luar)
    // ==========================================
    window.addEventListener("click", function (e) {
        // Tutup Notifikasi jika klik di luar area notifikasi
        if (dropdownNotif && btnNotif) {
            if (!dropdownNotif.contains(e.target) && !btnNotif.contains(e.target)) {
                dropdownNotif.classList.remove("active");
            }
        }

        // Tutup Profil jika klik di luar area profil
        if (dropdownProfile && btnProfile) {
            if (!dropdownProfile.contains(e.target) && !btnProfile.contains(e.target)) {
                dropdownProfile.classList.remove("active");
            }
        }

        // Sidebar tidak perlu di-handle disini karena sudah ada overlay click event
    });

    // ==========================================
    // 5. LOGIKA BADGE NOTIFIKASI (Opsional)
    // ==========================================
    function updateNotificationBadge() {
        const unreadItems = document.querySelectorAll(".notif-item.unread");
        if (badge) {
            badge.style.display = unreadItems.length > 0 ? "block" : "none";
        }
    }

    if (btnMarkRead) {
        btnMarkRead.addEventListener("click", function (e) {
            e.preventDefault();
            const unreadItems = document.querySelectorAll(".notif-item.unread");
            unreadItems.forEach((item) => {
                item.classList.remove("unread");
                const dot = item.querySelector(".dot-unread");
                if (dot) dot.remove();
            });
            updateNotificationBadge();
        });
    }

    // Jalankan cek badge saat halaman dimuat pertama kali
    updateNotificationBadge();
});
