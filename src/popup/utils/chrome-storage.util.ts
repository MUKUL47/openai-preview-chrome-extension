import { ChromeStorage, OpenAIConfig } from "../../types";
import OpenAIUtil from "./openai.util";

export class ChromeStorageService {
  public static async get<T extends unknown>(k: ChromeStorage): Promise<T> {
    return (await chrome.storage.local.get(k))[k];
  }

  public static async set(k: ChromeStorage, v: any): Promise<void> {
    await chrome.storage.local.set({ [k]: v });
    return;
  }

  public static async getConfigs(): Promise<OpenAIConfig[]> {
    const resp = await this.get<OpenAIConfig[]>(ChromeStorage.OPENAI_CONFIGS);
    return (!!resp && resp) || [];
  }

  public static async deleteConfig(id: number): Promise<void> {
    const configs = await this.getConfigs();
    const idx = configs.findIndex((v) => v.id === id);
    if (idx === -1) return;
    configs.splice(idx, 1);
    await this.set(ChromeStorage.OPENAI_CONFIGS, configs);
  }

  public static async updateConfigs(
    config: Partial<OpenAIConfig>
  ): Promise<void> {
    const configs = await this.getConfigs();
    if (config.id) {
      const idx = configs.findIndex((v) => v.id === config.id);
      if (idx > -1) {
        configs[idx] = config as OpenAIConfig;
        await this.set(ChromeStorage.OPENAI_CONFIGS, configs);
        return;
      }
      return;
    }
    await this.set(
      ChromeStorage.OPENAI_CONFIGS,
      configs.concat(config as OpenAIConfig)
    );
  }

  public static async initializeConfigs(): Promise<void> {
    try {
      const configs = await this.getConfigs();
      if (configs.length === 0) {
        await this.set(ChromeStorage.OPENAI_CONFIGS, OpenAIUtil.defaultConfigs);
      }
    } catch (e) {}
  }
}
