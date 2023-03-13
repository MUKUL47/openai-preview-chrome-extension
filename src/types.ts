import {CreateCompletionRequest} from 'openai'
enum ChromeEvents{
    ACTION_SELECTED_TEXT = "ACTION_SELECTED_TEXT", 
}
enum ChromeStorage{
    OPENAI_API = "OPENAI_API",
    OPENAI_CONFIGS="OPENAI_CONFIGS"
}
enum OpenAIModeName{
    ANALYSE_SELECTED_TEXT="ANALYSE_SELECTED_TEXT"
}
type OpenAIConfig = {
    id : number;
    name : string;
    isDefault ?:boolean;
    config : Record<string,any>;
}
type OpenAIMode = {
    value : OpenAIModeName,
     name : string
}

export {ChromeEvents, ChromeStorage, OpenAIConfig, OpenAIMode, OpenAIModeName}