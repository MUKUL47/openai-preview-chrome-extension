import { AxiosRequestConfig, Method } from "axios";
enum ChromeEvents {
  ACTION_SELECTED_TEXT = "ACTION_SELECTED_TEXT",
  ACTION_ONSCROLL = "ACTION_ONSCROLL",
}
enum ChromeStorage {
  OPENAI_API = "OPENAI_API",
  OPENAI_CONFIGS = "OPENAI_CONFIGS",
}
enum OpenAIModeName {
  SIMPLE_QUERY = "SIMPLE_QUERY",
  ANALYSE_SELECTED_TEXT = "ANALYSE_SELECTED_TEXT",
  TEXT_TO_IMAGE = "TEXT_TO_IMAGE",
  TRANSCRIPTIONS = "TRANSCRIPTIONS",
  TRANSLATIONS = "TRANSLATIONS",
}
type OpenAIConfig = {
  id: number;
  name: string;
  isDefault?: boolean;
  config: Record<string, any>;
  url: string;
  method?: Method | "POST";
  axiosConfig?: Record<string, any>;
  fontSizeInPx?: number;
};

export { ChromeEvents, ChromeStorage, OpenAIConfig, OpenAIModeName };
