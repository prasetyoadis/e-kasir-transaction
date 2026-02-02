/**
 * Global Toast Notification System
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {string} type - 'success', 'warning', atau 'error'
 * @param {string} title - Judul toast (Opsional)
 */
export function showToast(message, type = 'error', title = '') {
    const container = document.getElementById("toast-container");

    // Default title berdasarkan type jika tidak diisi
    const defaultTitles = {
        success: 'Berhasil',
        warning: 'Peringatan',
        error: 'Kesalahan'
    };

    const displayTitle = title || defaultTitles[type];

    // Icon SVGs
    const icons = {
        success: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>',
        warning: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"></path></svg>',
        error:   '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
    };

    const toast = document.createElement("div");
    toast.className = `toast ${type} ${type}-toast`;

    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <span class="toast-title">${displayTitle}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        <div class="progress"></div>
    `;

    container.appendChild(toast);

    // Animasi masuk
    setTimeout(() => toast.classList.add("show"), 100);

    // Auto remove setelah 5 detik
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => { if(toast.parentNode) toast.remove(); }, 500);
    }, 5000);
}
