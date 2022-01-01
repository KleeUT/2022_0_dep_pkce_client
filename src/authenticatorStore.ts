import { getLocalStorage } from "./windowWrapper";

const verifierKey = "verifier";

export function storeVerifier(verifier: string) {
  getLocalStorage().setItem(verifierKey, JSON.stringify({ verifier }));
}

export function getVerifier(): { verifier: string } {
  return JSON.parse(getLocalStorage().getItem(verifierKey));
}
