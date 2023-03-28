import { Method } from "axios";
enum ChromeStorage {
  OPENAI_API = "OPENAI_API",
  OPENAI_CONFIGS = "OPENAI_CONFIGS",
  OPENAI_CONFIGS_ORIGINAL = "OPENAI_CONFIGS_ORIGINAL",
}
enum OpenAIModeName {
  ANALYSE_SELECTED_TEXT = "ANALYSE_SELECTED_TEXT",
  TEXT_TO_IMAGE = "TEXT_TO_IMAGE",
  TRANSCRIPTIONS = "TRANSCRIPTIONS",
  TRANSLATIONS = "TRANSLATIONS",
}
type OpenAIConfig = {
  name: string;
  isDefault?: boolean;
  config: Record<string, any>;
  url: string;
  method?: Method | "POST";
  axiosConfig?: Record<string, any>;
  fontSizeInPx?: number;
};

export { ChromeStorage, OpenAIConfig, OpenAIModeName };
