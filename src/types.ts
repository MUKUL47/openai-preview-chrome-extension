import { Method } from "axios";
enum ChromeEvents {
  ACTION_SELECTED_TEXT = "ACTION_SELECTED_TEXT",
  ACTION_ONSCROLL = "ACTION_ONSCROLL",
}
enum ChromeStorage {
  OPENAI_API = "OPENAI_API",
  OPENAI_CONFIGS = "OPENAI_CONFIGS",
}
enum OpenAIModeName {
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
};

export { ChromeEvents, ChromeStorage, OpenAIConfig, OpenAIModeName };
