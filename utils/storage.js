// utils/storage.js
// Thin wrapper around expo-secure-store for credentials/tokens.
// SecureStore only accepts strings and can reject very large payloads,
// so everything is JSON-encoded and kept small here.

import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "gists.session";
const ACCOUNTS_KEY = "gists.accounts";

export async function getItem(key) {
  try {
    const raw = await SecureStore.getItemAsync(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to read "${key}"`, error);
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to write "${key}"`, error);
    return false;
  }
}

export async function removeItem(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    if (__DEV__) console.warn(`[storage] failed to delete "${key}"`, error);
    return false;
  }
}

export const getSession = () => getItem(SESSION_KEY);
export const setSession = (session) => setItem(SESSION_KEY, session);
export const clearSession = () => removeItem(SESSION_KEY);

export const getAccounts = () => getItem(ACCOUNTS_KEY);
export const setAccounts = (accounts) => setItem(ACCOUNTS_KEY, accounts);

export const STORAGE_KEYS = { SESSION_KEY, ACCOUNTS_KEY };
