import { ChromeStorage, OpenAIConfig } from "./types"

export class ChromeStorageService{
    private static readonly defaultConfig : OpenAIConfig ={
        name : 'Default Config',
        id : -1,
        isDefault : true,
        config : {
            model : 'text-davinci-003',
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }
    }

    public static async get<T extends unknown>(k : ChromeStorage) : Promise<T> {
        return (await chrome.storage.local.get(k))[k]
    }

    public static async set(k : ChromeStorage, v : any) : Promise<void>{
        await chrome.storage.local.set({[k] : v});
        return;
    }
    
    public static async hasAPIKey() :Promise<boolean>{
        return !!(await this.get(ChromeStorage.OPENAI_API))
    }

    public static async updateAPIKey(key : string) : Promise<void> {
        await this.set(ChromeStorage.OPENAI_API, key)
    }

    public static async getConfigs() : Promise<OpenAIConfig[]>{
        const resp = await chrome.storage.local.get(ChromeStorage.OPENAI_CONFIGS)
        if(!!!resp[ChromeStorage.OPENAI_CONFIGS]) return []
        return resp[ChromeStorage.OPENAI_CONFIGS]
    }

    public static async deleteConfig(id : number) : Promise<void> {
        const configs = await this.getConfigs();
        const idx = configs.findIndex(v => v.id === id);
        if(idx === -1) return;
        configs.splice(idx, 1);
        await chrome.storage.local.set({ [ChromeStorage.OPENAI_CONFIGS] : configs })
    }

    public static async updateConfigs(config : Partial<OpenAIConfig>) : Promise<void> {
        const configs = await this.getConfigs()
        if(config.id){
            const idx = configs.findIndex(v => v.id === config.id);
            if(idx > -1){
                configs[idx] = config as OpenAIConfig;
                await chrome.storage.local.set({ [ChromeStorage.OPENAI_CONFIGS] : configs })
                return
            }
            return;
        }
        await this.set(ChromeStorage.OPENAI_CONFIGS, configs.concat(config as OpenAIConfig))
    }

    public static async initializeConfigs() : Promise<void> {
        try{
            const configs = await this.getConfigs();
            console.log('config',configs)
            if(configs.length === 0) {
                await this.set(ChromeStorage.OPENAI_CONFIGS, [this.defaultConfig])
            };
        }catch(e){}
    }
}