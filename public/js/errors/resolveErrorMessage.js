import { ERROR_MESSAGES_EN } from './errorMessages.en.js';
import { ERROR_MESSAGES_ID } from './errorMessages.id.js';

export function resolveErrorMessage(errorCode, lang = 'id') {
    const messages = lang === 'en'? ERROR_MESSAGES_EN : ERROR_MESSAGES_ID;
    const DEFAULT_ERROR_MESSAGE = lang === 'en' ? "Something went wrong. Please try again." : 'Terjadi kesalahan. Silakan coba lagi.';
    
    return messages[errorCode] || DEFAULT_ERROR_MESSAGE;
}