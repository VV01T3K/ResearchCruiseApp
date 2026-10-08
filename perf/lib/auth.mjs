// Logs in once through the API and hands the session to fresh browser contexts
// without logging in again, so login is never part of a measurement.
//
// Why not a plain storageState file:
//  - new (v2): the refresh token is an HttpOnly cookie that is rotated on every
//    /v2/auth/refresh, and login+refresh share a 10 requests/minute/IP limit.
//    A saved cookie would therefore work for one context only. Instead each
//    context answers /v2/auth/refresh locally with the token obtained here; every
//    other request (users/me, the list, ...) goes to the real backend.
//  - old (legacy): tokens live in localStorage['authDetails']; an init script puts
//    them there before the app boots (equivalent to storageState, but refreshed
//    when the access token gets old).

import { opt } from './config.mjs';

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export class AuthSession {
  constructor({ mode, apiUrl, loginPath, credentials }) {
    this.mode = mode;
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.loginPath = loginPath;
    this.refreshPath = opt('REFRESH_PATH', '/v2/auth/refresh');
    this.storageKey = opt('AUTH_STORAGE_KEY', 'authDetails');
    this.credentials = credentials;
    this.token = undefined;
  }

  async login() {
    const res = await fetch(this.apiUrl + this.loginPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.credentials),
    });
    if (!res.ok) {
      throw new Error(`Login failed: ${res.status} ${res.statusText} ${await res.text().catch(() => '')}`);
    }
    this.token = await res.json();
    if (!this.token.accessToken) throw new Error('Login response has no accessToken');
    return this.token;
  }

  /** Re-logs in when the access token is close to expiry (long runs, big N). */
  async ensureFresh() {
    const expires = this.token ? Date.parse(this.token.accessTokenExpirationDate) : 0;
    if (!this.token || !Number.isFinite(expires) || expires - Date.now() < REFRESH_MARGIN_MS) {
      await this.login();
    }
  }

  get accessToken() {
    return this.token?.accessToken;
  }

  async installInContext(context, baseUrl) {
    await this.ensureFresh();
    const origin = new URL(baseUrl).origin;

    if (this.mode === 'legacy') {
      await context.addInitScript(
        ({ origin, key, details }) => {
          if (location.origin === origin) localStorage.setItem(key, JSON.stringify(details));
        },
        { origin, key: this.storageKey, details: this.token }
      );
      return;
    }

    if (this.mode === 'v2') {
      const body = JSON.stringify({
        accessToken: this.token.accessToken,
        accessTokenExpirationDate: this.token.accessTokenExpirationDate,
        refreshTokenExpirationDate: this.token.refreshTokenExpirationDate,
      });
      await context.route(this.apiUrl + this.refreshPath, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
          },
          body,
        })
      );
      return;
    }

    throw new Error(`Unknown AUTH_MODE "${this.mode}" (legacy|v2)`);
  }
}
