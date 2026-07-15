const STORAGE_KEY = 'gameon-offline-tokens';

export interface StoredKeycloakTokens {
  token: string;
  refreshToken: string;
  idToken: string;
}

export function readStoredKeycloakTokens(): StoredKeycloakTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredKeycloakTokens) : null;
  } catch {
    return null;
  }
}

export function storeKeycloakTokens(tokens: StoredKeycloakTokens): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredKeycloakTokens(): void {
  localStorage.removeItem(STORAGE_KEY);
}
