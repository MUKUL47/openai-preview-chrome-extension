import axios, { AxiosRequestConfig } from "axios";
import { ChromeStorage, OpenAIConfig, OpenAIModeName } from "../types";
import { ChromeStorageService } from "./chrome-storage.util";
import openAIModes from "./open-ai-modes";

export default class OpenAIUtil {
  private static API_KEY: string = "";
  public static defaultConfigs: OpenAIConfig[] = openAIModes;
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

  public static async deleteConfig(name: OpenAIModeName): Promise<void> {
    const configs = await this.getConfigs();
    const idx = configs.findIndex((v) => v.name === name);
    if (idx === -1) return;
    configs.splice(idx, 1);
    await ChromeStorageService.set(ChromeStorage.OPENAI_CONFIGS, configs);
  }

  public static async updateConfigs(
    config: Partial<OpenAIConfig>
  ): Promise<void> {
    const configs = await this.getConfigs();
    if (config.name) {
      const idx = configs.findIndex((v) => v.name === config.name);
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
  public static async getConfigs(original?: boolean): Promise<OpenAIConfig[]> {
    const resp = await ChromeStorageService.get<OpenAIConfig[]>(
      (original && ChromeStorage.OPENAI_CONFIGS_ORIGINAL) ||
        ChromeStorage.OPENAI_CONFIGS
    );
    return (!!resp && resp) || [];
  }

  public static async initializeConfigs(): Promise<OpenAIConfig[]> {
    try {
      if (
        !(await ChromeStorageService.get<OpenAIConfig[]>(
          ChromeStorage.OPENAI_CONFIGS
        ))
      ) {
        await ChromeStorageService.set(
          ChromeStorage.OPENAI_CONFIGS,
          OpenAIUtil.defaultConfigs
        );
      }
      if (
        !(await ChromeStorageService.get<string>(
          ChromeStorage.OPENAI_CONFIGS_ORIGINAL
        ))
      ) {
        this.getConfigs().then((c) =>
          ChromeStorageService.set(ChromeStorage.OPENAI_CONFIGS_ORIGINAL, c)
        );
      }
      return this.getConfigs();
    } catch (e) {
      return [];
    }
  }
}
