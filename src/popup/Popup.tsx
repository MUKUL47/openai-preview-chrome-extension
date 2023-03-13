import { useEffect, useMemo, useState } from 'react'
import { ChromeStorage } from '../types'
import { ChromeStorageService } from '../utils'
import './Popup.css'
import PopupService from './popup.service'
function App() {
  const [{service}, setService] = useState<Record<string, PopupService>>({service : new PopupService()})
  useEffect(() => {
    initialize()
  },[])

  async function initialize(){
    try{
      const [,configs, hasApiKey, apiKey] = await Promise.all([
        ChromeStorageService.initializeConfigs(),
        ChromeStorageService.getConfigs(), 
        ChromeStorageService.hasAPIKey(),
        ChromeStorageService.get<string>(ChromeStorage.OPENAI_API)
      ])
      service.openAIConfigs = configs;
      service.selectedConfig = configs.find(v => !!v.isDefault) || null
      service.hasApiKey = hasApiKey;
      setService({ service : service.setOpenAIInstance(apiKey).intializedService() })
    }catch(e){
    }
  }
  const Mode  = useMemo(() => {
    return service.GetActiveMode(service.selectedMode?.value!)
  },[service.selectedMode])
  return (
    <div className="flex flex-col gap-3 m-6">
     {service.hasApiKey &&
      <>
       <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
          <p>Select Mode</p>
          <p>Select Config</p>
          </div>
          <div className='flex gap-2'>
            <select className="p-2 rounded-md flex-1" value={service.selectedMode?.value}>
              {
                service.openAIModes?.map((mode) => <option value={mode.value} key={mode.value}>{mode.name}</option>)
              }
            </select>
            <select className="p-2 rounded-md flex-1" value={service.selectedConfig?.id}>
              {
                service.openAIConfigs?.map((config) => <option value={config.id} key={config.id}>{config.name}</option>)
              }
            </select>
          </div>
      </div>
      {
        Mode && <Mode openAIInstance={service.openAIInstance} config={service.selectedConfig}/>
      }
      </> || <div className="flex flex-col gap-2">
        <input type="password" placeholder='OpenAPI Key' value={service.apiKeyInp}  onChange={e => {
          service.apiKeyInp = e.target.value;
          setService({ service })
        }}/>
        <button onClick={async () => {
          await ChromeStorageService.set(ChromeStorage.OPENAI_API, service.apiKeyInp)
          initialize()
        }}>Done</button>
      </div>
     }
    </div>
  );
}

export default App
