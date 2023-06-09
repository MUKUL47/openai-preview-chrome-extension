import { OpenAIConfig, OpenAIModeName } from "../types";
import AudioMode from "./openai-models/audio-mode";
import SelectedText from "./openai-models/selected-text";
import TextToImage from "./openai-models/text-to-image";

export default class PopupService {
  private static readonly POPUP_CHROME_EVENT_ID = `${Date.now()}-${Math.random()}`;
  public isIntializing = true;
  public hasApiKey = false;
  public openAIConfigs: OpenAIConfig[] = [];
  //
  public selectedConfig: OpenAIConfig | null = null;

  //
  public apiKeyInp = "";

  constructor() {}

  public intializedService(): this {
    this.isIntializing = false;
    return this;
  }

  public static getPopupChromeEventId() {
    return this.POPUP_CHROME_EVENT_ID;
  }

  public GetActiveMode(config: OpenAIConfig): Function | null {
    switch (config?.name) {
      case OpenAIModeName.ANALYSE_SELECTED_TEXT:
        return SelectedText;
      case OpenAIModeName.TEXT_TO_IMAGE:
        return TextToImage;
      case OpenAIModeName.TRANSCRIPTIONS:
      case OpenAIModeName.TRANSLATIONS:
        return AudioMode;
      default:
        return null;
    }
  }
}
