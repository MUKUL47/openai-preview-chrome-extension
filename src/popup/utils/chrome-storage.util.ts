import { ChromeStorage } from "../../types";

export class ChromeStorageService {
  public static async get<T extends unknown>(k: ChromeStorage): Promise<T> {
    return (await chrome.storage.local.get(k))[k];
  }

  public static async set(k: ChromeStorage, v: any): Promise<void> {
    await chrome.storage.local.set({ [k]: v });
  }

  public static async delete(k: ChromeStorage): Promise<void> {
    await chrome.storage.local.delete(k);
  }
}
