import { resolveErrorMessage } from './resolveErrorMessage.js';
import { showToast } from '../toast.js';
// Import langsung untuk pengecekan debug (opsional, hapus nanti)
// import { ERROR_MESSAGES_ID } from './errorMessages.id.js'; 

export function handleApiError(errorCode, type = 'error') {
  // Cek kode apa yang dikirim
  // console.log(":fire: [DEBUG] Kode Error yang diterima:", errorCode);

  // Cek apakah kamus pesan sudah memuat teks barumu?
  // console.log(":fire: [DEBUG] Isi Kamus Pesan saat ini:", ERROR_MESSAGES_ID[errorCode]);

  const message = resolveErrorMessage(errorCode);
  // console.log(":fire: [DEBUG] Pesan final yang akan muncul:", message);

  showToast(message, type);
} 