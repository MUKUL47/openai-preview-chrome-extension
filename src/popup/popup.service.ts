import { OpenAIConfig, OpenAIModeName } from "../types";
import SelectedText from "./openai-models/selected-text";
import SimpleQuery from "./openai-models/simple-query";
import TextToImage from "./openai-models/text-to-image";
import TranscriptionAudio from "./openai-models/transcriptions-audio";
import TranslateAudioEn from "./openai-models/translate-audio-en";

export default class PopupService {
  public static TRANSPILED_CODE: any = null;
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
        return TranscriptionAudio;
      case OpenAIModeName.TRANSLATIONS:
        return TranslateAudioEn;
      case OpenAIModeName.SIMPLE_QUERY:
        return SimpleQuery;
      default:
        return null;
    }
  }
}
