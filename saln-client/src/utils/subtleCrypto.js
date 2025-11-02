
/**
 *  Note that this is how we generated the encryption key
 *  and turned it into a base64 string to be stored into sql.
 *  We want to make it into functions.
 */
// // Generate encryption key for this employee
// const cryptoKey = await crypto.subtle.generateKey(
//   {name: "AES-GCM", length: 256},
//   true,
//   ["encrypt", "decrypt"]
// );

// // Export the key to a base64 string so it can be sent and stored into the database
// const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);
// const exportedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));


/**
 * 
 * @param { ArrayBuffer } buffer 
 * @returns { string } exportedKeyBase64 
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // chunk to avoid call stack issues for larger arrays
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * 
 * @param { string } base64 
 * @returns { ArrayBuffer }
 */
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// import a raw base64 key as CryptoKey
/**
 * 
 * @param { string } keyBase64 
 * @returns { CryptoKey }
 */
export async function getCryptoKeyFromBase64(keyBase64) {
  const raw = base64ToArrayBuffer(keyBase64);
  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false, // not extractable after import (we keep it non-extractable)
    ["encrypt", "decrypt"]
  );
  return key;
}

// encrypt a UTF-8 string and return base64(iv + ciphertext)
/**
 * 
 * @param { CryptoKey } key 
 * @param { string } plaintext 
 * @returns { string } encryptedInBase64 
 */
export async function encryptStringWithCryptoKey(plaintext, key) {
  if (!key) throw new Error("No CryptoKey provided");

  const enc = new TextEncoder();
  const data = enc.encode(plaintext);

  // AES-GCM standard: 12 byte IV is recommended
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  // combine iv + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return arrayBufferToBase64(combined.buffer);
}

// decrypt base64(iv + ciphertext) -> plaintext string
/**
 * 
 * @param { CryptoKey } key
 * @param { string } ivCipherBase64 
 * @returns { string } plaintext
 */
export async function decryptStringWithCryptoKey(ivCipherBase64, key) {
  if (!key) throw new Error("No base64 key provided");

  const combinedBuf = base64ToArrayBuffer(ivCipherBase64);
  const combined = new Uint8Array(combinedBuf);

  // first 12 bytes = IV
  const iv = combined.subarray(0, 12);
  const ciphertext = combined.subarray(12);

  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(plainBuf);
}