import { Injectable, effect, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import {
  clearStoredKeycloakTokens,
  storeKeycloakTokens,
} from './keycloak-offline-tokens';

/**
 * Persists the Keycloak token/refreshToken/idToken to localStorage so the
 * `offline_access` refresh token survives a closed tab/browser restart and
 * can be handed back to `provideKeycloak`'s `initOptions` on next boot.
 */
@Injectable({ providedIn: 'root' })
export class KeycloakOfflinePersistenceService {
  private readonly keycloak = inject(Keycloak);

  constructor() {
    const keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

    effect(() => {
      const event = keycloakSignal();

      // `Ready` fires right after `AuthSuccess`/`AuthRefreshSuccess` and
      // overwrites the signal before this effect (created post-bootstrap)
      // gets a chance to observe the earlier event, so re-derive the
      // "should persist" condition from Keycloak's live state instead of
      // matching on a single event type.
      if (this.keycloak.authenticated && this.keycloak.refreshToken) {
        storeKeycloakTokens({
          token: this.keycloak.token ?? '',
          refreshToken: this.keycloak.refreshToken,
          idToken: this.keycloak.idToken ?? '',
        });
        return;
      }

      switch (event.type) {
        case KeycloakEventType.AuthError:
        case KeycloakEventType.AuthRefreshError:
        case KeycloakEventType.AuthLogout:
          clearStoredKeycloakTokens();
          break;
      }
    });
  }
}
