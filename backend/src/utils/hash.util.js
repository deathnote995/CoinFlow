import { createHash } from 'node:crypto';

export const generateTransactionHash = ({ walletId, date, amount, type, description }) => {
    const normalizedDate = new Date(date || Date.now()).toISOString().split('T')[0]; // YYYY-MM-DD
    const normalizedDesc = description.trim().toLowerCase();
    const rawFingerprint = `${walletId}|${normalizedDate}|${Number(amount)}|${type}|${normalizedDesc}`;

    return createHash('sha256').update(rawFingerprint).digest('hex');
};