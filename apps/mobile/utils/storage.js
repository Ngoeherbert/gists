import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setItem(key, value) {
  try {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);

    await AsyncStorage.setItem(key, serialized);

    return true;
  } catch (error) {
    console.error(`Storage setItem error for "${key}":`, error);
    return false;
  }
}

export async function getItem(key, defaultValue = null) {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Storage getItem error for "${key}":`, error);
    return defaultValue;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Storage removeItem error for "${key}":`, error);
    return false;
  }
}

export async function clearStorage() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Storage clear error:", error);
    return false;
  }
}

export async function hasItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    return false;
  }
}

export async function multiSet(items) {
  try {
    const serialized = items.map(([key, value]) => [
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    ]);

    await AsyncStorage.multiSet(serialized);

    return true;
  } catch (error) {
    console.error("Storage multiSet error:", error);
    return false;
  }
}

export async function multiRemove(keys) {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error("Storage multiRemove error:", error);
    return false;
  }
}

export default {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  hasItem,
  multiSet,
  multiRemove,
};
