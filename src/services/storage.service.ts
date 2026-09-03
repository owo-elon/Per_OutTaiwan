export function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}"`, error);
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}"`, error);
  }
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}"`, error);
  }
}

export function readStorageJson<T>(key: string, fallback: T): T {
  const value = readStorage(key);
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage key "${key}"`, error);
    return fallback;
  }
}

export function writeStorageJson(key: string, value: unknown) {
  writeStorage(key, JSON.stringify(value));
}
