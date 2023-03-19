import { OpenAIConfig, OpenAIModeName } from "../types";
import SelectedText from "./openai-models/selected-text";
import TranscriptText from "./openai-models/transcript-text";

export default class PopupService {
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

  public GetActiveMode(config: OpenAIConfig): Function | null {
    switch (config?.name) {
      case OpenAIModeName.ANALYSE_SELECTED_TEXT:
        return SelectedText;
      case OpenAIModeName.TEXT_TO_IMAGE:
        return TranscriptText;
      default:
        return null;
    }
  }
}
