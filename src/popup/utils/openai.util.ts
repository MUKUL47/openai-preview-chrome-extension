import axios, { AxiosRequestConfig } from "axios";
import { ChromeStorage, OpenAIConfig } from "../../types";
import { ChromeStorageService } from "./chrome-storage.util";
import openAIModes from "./open-ai-modes";

export default class OpenAIUtil {
  private static API_KEY: string = "";
  public static readonly defaultConfigs: OpenAIConfig[] = openAIModes;
  public static getApiKey(): string {
    return this.API_KEY;
  }
  public static setAPIKey(k: string) {
    this.API_KEY = k;
  }

  public static getAxiosConfig(
    openAIConfig: OpenAIConfig,
    optionalConfig?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...optionalConfig,
      url: openAIConfig.url,
      method: openAIConfig.method,
      data: JSON.stringify(openAIConfig.config),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
    };
  }

  public static getOpenAIAPI<T extends any>(
    axiosConfig: AxiosRequestConfig
  ): Promise<T> {
    return axios(axiosConfig);
  }

  //

  public static async deleteConfig(id: number): Promise<void> {
    const configs = await this.getConfigs();
    const idx = configs.findIndex((v) => v.id === id);
    if (idx === -1) return;
    configs.splice(idx, 1);
    await ChromeStorageService.set(ChromeStorage.OPENAI_CONFIGS, configs);
  }

  public static async updateConfigs(
    config: Partial<OpenAIConfig>
  ): Promise<void> {
    const configs = await this.getConfigs();
    if (config.id) {
      const idx = configs.findIndex((v) => v.id === config.id);
      if (idx > -1) {
        configs[idx] = config as OpenAIConfig;
        await ChromeStorageService.set(ChromeStorage.OPENAI_CONFIGS, configs);
        return;
      }
      return;
    }
    await ChromeStorageService.set(
      ChromeStorage.OPENAI_CONFIGS,
      configs.concat(config as OpenAIConfig)
    );
  }

  public static getStyle(config: OpenAIConfig): Record<string, any> {
    return (
      (config?.fontSizeInPx && {
        fontSize: `${config?.fontSizeInPx}px`,
      }) ||
      {}
    );
  }
  public static async getConfigs(): Promise<OpenAIConfig[]> {
    const resp = await ChromeStorageService.get<OpenAIConfig[]>(
      ChromeStorage.OPENAI_CONFIGS
    );
    return (!!resp && resp) || [];
  }
  public static async initializeConfigs(): Promise<OpenAIConfig[]> {
    try {
      await ChromeStorageService.set(
        ChromeStorage.OPENAI_CONFIGS,
        OpenAIUtil.defaultConfigs
      );
      return this.getConfigs();
    } catch (e) {
      return [];
    }
  }
}
