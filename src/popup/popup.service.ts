import { OpenAIConfig, OpenAIModeName } from "../types";
import SelectedText from "./openai-models/selected-text";
import SimpleQuery from "./openai-models/simple-query";
import TextToImage from "./openai-models/text-to-image";
import TranscriptionAudio from "./openai-models/transcriptions-audio";
import TranslateAudioEn from "./openai-models/translate-audio-en";

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
    switch (config?.id) {
      case -1:
        return SelectedText;
      case -2:
        return TextToImage;
      case -3:
        return TranscriptionAudio;
      case -4:
        return TranslateAudioEn;
      case -5:
        return SimpleQuery;
      default:
        return null;
    }
  }
}
