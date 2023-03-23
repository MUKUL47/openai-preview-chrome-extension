import axios, { AxiosRequestConfig } from "axios";
import { OpenAIConfig, OpenAIModeName } from "../../types";

export default class OpenAIUtil {
  private static API_KEY: string = "";
  public static readonly defaultConfigs: OpenAIConfig[] = [
    {
      name: OpenAIModeName.ANALYSE_SELECTED_TEXT,
      id: -1,
      isDefault: true,
      config: {
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      url: "https://api.openai.com/v1/completions",
      method: "POST",
    },
    {
      name: OpenAIModeName.TEXT_TO_IMAGE,
      id: -2,
      config: {
        n: 1,
        size: "256x256",
      },
      url: "https://api.openai.com/v1/images/generations",
      method: "POST",
    },
    {
      name: OpenAIModeName.TRANSCRIPTIONS,
      id: -3,
      config: {
        model: "whisper-1",
      },
      url: "https://api.openai.com/v1/audio/transcriptions",
      method: "POST",
    },
    {
      name: OpenAIModeName.TRANSLATIONS,
      id: -4,
      config: {
        model: "whisper-1",
      },
      url: "https://api.openai.com/v1/audio/translations",
      method: "POST",
    },
  ];
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
}
