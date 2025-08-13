import crypto from "crypto";

const base64Key = process.env.APP_ENCRYPTION_KEY || "";
const key = base64Key ? Buffer.from(base64Key, "base64") : null;

function getKey(): Buffer {
  if (!key) throw new Error("APP_ENCRYPTION_KEY is not set");
  if (key.length !== 32) throw new Error("APP_ENCRYPTION_KEY must be 32 bytes (base64)");
  return key;
}

export function encryptString(plaintext: string): string {
  const k = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", k, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export function decryptString(encoded: string): string {
  const k = getKey();
  const data = Buffer.from(encoded, "base64");
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", k, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  return plaintext;
} 