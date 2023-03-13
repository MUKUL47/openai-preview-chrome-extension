import { Configuration, OpenAIApi } from "openai";
import { ChromeEvents, ChromeStorage, OpenAIConfig, OpenAIMode, OpenAIModeName } from "../types";
import SelectedText from "./selected-text";

export default class PopupService{
    public openAIModes : OpenAIMode[] = []
    public openAIInstance : OpenAIApi | null = null;
    public isIntializing  = true;
    public hasApiKey = false;
    public openAIConfigs : OpenAIConfig[] = [];
    //
    public selectedConfig : OpenAIConfig|null = null;
    public selectedMode : OpenAIMode|null = null;

    //
    public apiKeyInp = '';

    constructor(){
        this.openAIModes = [{
            value : OpenAIModeName.ANALYSE_SELECTED_TEXT,
            name : 'Analyse Selected Text'
        }]
        this.selectedMode = this.openAIModes[0]
    }

    public setOpenAIInstance(apiKey : string) : this{
        this.openAIInstance = new OpenAIApi(new Configuration({ apiKey }))
        return this;
    }

    public intializedService() : this{
        this.isIntializing = false;
        return this;
    }

    public GetActiveMode(openAIModelName : OpenAIModeName) : Function | null{
        switch(openAIModelName){
            case OpenAIModeName.ANALYSE_SELECTED_TEXT:
                return SelectedText;
            default : return null
        }
    }

}