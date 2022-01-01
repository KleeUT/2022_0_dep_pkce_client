export function getCryptoSubtle(): SubtleCrypto {
  return getCrypto().subtle;
}

export function base64(data: string): string {
  return btoa(data);
}

export function getLocalStorage(): Storage {
  return localStorage;
}

export function getCrypto(): Crypto {
  return globalThis.crypto;
}
