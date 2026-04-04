import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const keyString = process.env.ENCRYPTION_KEY;
const key = Buffer.from(keyString, 'hex');
const ivLength = 16;

export function encryptData(text) {
    if (!text) return text;
    try {
        const textStr = typeof text === 'object' ? JSON.stringify(text) : String(text);
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(textStr, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch(e) {
        console.error("Encryption error:", e);
        return text;
    }
}

export function decryptData(text) {
    if (typeof text !== 'string' || !text.includes(':')) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        try {
            return JSON.parse(decrypted);
        } catch(err) {
            return decrypted;
        }
    } catch(e) {
        console.error("Decryption error:", e);
        return text; // Return unencrypted original on fail
    }
}