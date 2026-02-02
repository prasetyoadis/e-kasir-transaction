import { loginUser } from './auth/login.js';
import { registerUser } from './auth/register.js';

document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. INISIALISASI ELEMEN
    // ==========================================

    // --- Elemen Login ---
    const formLogin = document.getElementById("formLogin");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    // --- Elemen Register ---
    const formRegister = document.getElementById("formRegister");
    const regName = document.getElementById("regName");
    const regEmail = document.getElementById("regEmail");
    const regPhone = document.getElementById("regPhone");
    const regPassword = document.getElementById("regPassword");
    const regConfirm = document.getElementById("regConfirm");

    // --- Elemen Bendera ---
    const countryFlag = document.getElementById("countryFlag");

    // ==========================================
    // 2. FUNGSI RESET FORM (Callback)
    // ==========================================
    // Fungsi ini akan dikirim ke register.js untuk dijalankan saat sukses
    function resetRegisterForm() {
        if (formRegister) {
            // 1. Kosongkan semua input text
            formRegister.reset();

            // 2. Hapus garis hijau/merah (class success/error)
            const inputControls = formRegister.querySelectorAll('.input-control');
            inputControls.forEach(control => {
                control.classList.remove('success', 'error');
            });

            // 3. Reset Icon Bendera ke Globe (Default)
            if (countryFlag) {
                countryFlag.className = 'flag-icon fa-solid fa-earth-asia';
            }
        }
    }

    // ==========================================
    // 3. FITUR SHOW / HIDE PASSWORD
    // ==========================================
    setupPasswordToggle("loginPassword", "toggleLogin");
    setupPasswordToggle("regPassword", "toggleReg");
    setupPasswordToggle("regConfirm", "toggleConfirm");

    function setupPasswordToggle(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (input && icon) {
            icon.addEventListener("click", function () {
                const type = input.getAttribute("type") === "password" ? "text" : "password";
                input.setAttribute("type", type);

                this.classList.toggle("fa-eye");
                this.classList.toggle("fa-eye-slash");
            });
        }
    }

    // ==========================================
    // 4. LOGIC AUTO DETECT PHONE REGION
    // ==========================================
    if (regPhone) {
        regPhone.addEventListener('input', function(e) {
            let val = e.target.value;
            let currentFlagClass = 'fa-solid fa-earth-asia'; // Default Globe

            // Aturan Prefix Negara
            const countryRules = [
                // --- KHUSUS (3 Digit) ---
                { char: '080', code: '+81', flag: 'fi fi-jp' }, // Jepang
                { char: '090', code: '+81', flag: 'fi fi-jp' },
                { char: '070', code: '+81', flag: 'fi fi-jp' },
                { char: '020', code: '+856', flag: 'fi fi-la' }, // Laos

                // --- UMUM (2 Digit) ---
                { char: '08', code: '+62', flag: 'fi fi-id' },   // Indonesia
                { char: '01', code: '+60', flag: 'fi fi-my' },   // Malaysia
                { char: '06', code: '+66', flag: 'fi fi-th' },   // Thailand
                { char: '03', code: '+84', flag: 'fi fi-vn' },   // Vietnam
                { char: '05', code: '+84', flag: 'fi fi-vn' },   // Vietnam
                { char: '07', code: '+84', flag: 'fi fi-vn' },   // Vietnam

                // --- KONFLIK '09' ---
                { char: '09', code: '+63', flag: 'fi fi-ph' },   // Filipina

                // --- ASIA TIMUR ---
                { char: '1',  code: '+86', flag: 'fi fi-cn' },   // China
                { char: '852', code: '+852', flag: 'fi fi-hk' }, // Hong Kong
                { char: '853', code: '+853', flag: 'fi fi-mo' }, // Macau

                // --- DETEKSI MANUAL (+) ---
                { char: '+62', code: '+62', flag: 'fi fi-id' },
                { char: '+60', code: '+60', flag: 'fi fi-my' },
                { char: '+65', code: '+65', flag: 'fi fi-sg' }, // Singapura
                { char: '+81', code: '+81', flag: 'fi fi-jp' },
                { char: '+82', code: '+82', flag: 'fi fi-kr' }, // Korea
                { char: '+86', code: '+86', flag: 'fi fi-cn' },
                { char: '+84', code: '+84', flag: 'fi fi-vn' },
            ];

            // Cek Deteksi
            for (const rule of countryRules) {
                if (val.startsWith(rule.char) && !val.startsWith('+')) {
                    val = rule.code + val.substring(rule.char.length);
                    currentFlagClass = rule.flag;
                    break;
                }
                else if (val.startsWith(rule.code)) {
                    currentFlagClass = rule.flag;
                }
            }

            // Update Class Icon (Pertahankan class 'flag-icon')
            if (countryFlag) {
                countryFlag.className = 'flag-icon ' + currentFlagClass;
            }

            // Sanitasi Input
            val = val.replace(/[^0-9+]/g, '');
            if (val.includes('+') && val.indexOf('+') !== 0) {
                const hasPlus = val.startsWith('+');
                val = val.replace(/\+/g, '');
                if (hasPlus) val = '+' + val;
            }

            e.target.value = val;

            // Reset ke Globe jika kosong
            if (val === '') {
                countryFlag.className = 'flag-icon fa-solid fa-earth-asia';
            }
        });
    }

    // ==========================================
    // 5. LOGIC SUBMIT LOGIN
    // ==========================================
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!checkLoginInputs()) return;

            await loginUser(loginEmail.value, loginPassword.value);
        });
    }

    function checkLoginInputs() {
        let isValid = true;
        const emailValue = loginEmail.value.trim();
        const passValue = loginPassword.value.trim();

        if (emailValue === "") {
            setErrorFor(loginEmail, "Email tidak boleh kosong");
            isValid = false;
        } else if (!isEmail(emailValue)) {
            setErrorFor(loginEmail, "Format email salah");
            isValid = false;
        } else {
            setSuccessFor(loginEmail);
        }

        if (passValue === "") {
            setErrorFor(loginPassword, "Password wajib diisi");
            isValid = false;
        } else {
            setSuccessFor(loginPassword);
        }

        return isValid;
    }

    // ==========================================
    // 6. LOGIC SUBMIT REGISTER
    // ==========================================
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!checkRegisterInputs()) return;

            // Panggil API Register
            // Parameter terakhir adalah fungsi resetForm yang kita buat di atas
            await registerUser(
                regName.value,
                regEmail.value,
                regPhone.value,
                regPassword.value,
                resetRegisterForm // <--- KIRIM CALLBACK DISINI
            );
        });
    }

    function checkRegisterInputs() {
        let isValid = true;

        const nameVal = regName.value.trim();
        const emailVal = regEmail.value.trim();
        const phoneVal = regPhone.value.trim();
        const passVal = regPassword.value.trim();
        const confVal = regConfirm.value.trim();

        if (nameVal === "") {
            setErrorFor(regName, "Nama wajib diisi");
            isValid = false;
        } else {
            setSuccessFor(regName);
        }

        if (emailVal === "") {
            setErrorFor(regEmail, "Email wajib diisi");
            isValid = false;
        } else if (!isEmail(emailVal)) {
            setErrorFor(regEmail, "Email tidak valid");
            isValid = false;
        } else {
            setSuccessFor(regEmail);
        }

        if (phoneVal === "") {
            setErrorFor(regPhone, "No. HP wajib diisi");
            isValid = false;
        } else if (phoneVal.length < 10) {
            setErrorFor(regPhone, "Nomor HP terlalu pendek");
            isValid = false;
        } else {
            setSuccessFor(regPhone);
        }

        if (passVal === "") {
            setErrorFor(regPassword, "Password wajib diisi");
            isValid = false;
        } else if (passVal.length < 6) {
            setErrorFor(regPassword, "Minimal 6 karakter");
            isValid = false;
        } else {
            setSuccessFor(regPassword);
        }

        if (confVal === "") {
            setErrorFor(regConfirm, "Konfirmasi password wajib");
            isValid = false;
        } else if (passVal !== confVal) {
            setErrorFor(regConfirm, "Password tidak cocok");
            isValid = false;
        } else {
            setSuccessFor(regConfirm);
        }

        return isValid;
    }

    // Helper Functions
    function setErrorFor(input, message) {
        const inputControl = input.closest('.input-control');
        const small = inputControl.querySelector("small");

        small.innerText = message;
        inputControl.className = "input-control error";

        // Jaga class phone-wrapper
        if(input.id === 'regPhone') inputControl.classList.add('phone-wrapper');
    }

    function setSuccessFor(input) {
        const inputControl = input.closest('.input-control');
        inputControl.className = "input-control success";

        if(input.id === 'regPhone') inputControl.classList.add('phone-wrapper');
    }

    function isEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
});
