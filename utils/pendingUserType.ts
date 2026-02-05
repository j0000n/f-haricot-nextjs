export type UserTypeSelection = "creator" | "vendor";

const STORAGE_KEY = "pendingUserType";

const getWebStorage = () => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }

  return window.localStorage;
};

export const savePendingUserType = async (value: UserTypeSelection | null) => {
  const webStorage = getWebStorage();

  if (webStorage) {
    if (value) {
      webStorage.setItem(STORAGE_KEY, value);
    } else {
      webStorage.removeItem(STORAGE_KEY);
    }
  }
};

export const getPendingUserType = async (): Promise<UserTypeSelection | null> => {
  const webStorage = getWebStorage();

  if (webStorage) {
    const storedValue = webStorage.getItem(STORAGE_KEY) as UserTypeSelection | null;
    if (storedValue) {
      return storedValue;
    }
  }

  return null;
};

export const clearPendingUserType = async () => {
  const webStorage = getWebStorage();

  if (webStorage) {
    webStorage.removeItem(STORAGE_KEY);
  }
};
