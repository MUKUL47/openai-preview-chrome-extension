import { CreateCompletionRequest, OpenAIApi } from 'openai';
import React, { useEffect, useRef, useState } from 'react';
import { ChromeEvents, OpenAIConfig } from '../types';
interface Props extends  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    openAIInstance : OpenAIApi;
    config : OpenAIConfig;
} 
function SelectedText({ openAIInstance, config } : Props) {
  const contextRef = useRef<HTMLInputElement>(null)
  const [openAIResponse, setOpenAIResponse] = useState<string>('')
  useEffect(() => {
    console.log(openAIInstance, config)
        chrome.runtime.onMessage.addListener(onChromeEvent)
        return () => chrome.runtime.onMessage.removeListener(onChromeEvent)
    },[])
  const onChromeEvent = (message : Partial<{action : ChromeEvents, data : any}>) =>{
    if(message?.action !== ChromeEvents.ACTION_SELECTED_TEXT) return;
    analyseText(message.data)
}
  
  async function analyseText(s : string){
    if(typeof s !== 'string' || !!!s) return;
    const c = config.config as CreateCompletionRequest;
    c.prompt = `${contextRef.current?.value}\n"${s}"`
    console.log(c)
    const completion = await openAIInstance.createCompletion(c);
    const response = completion.data.choices[0].text || ''
    if(response){
      setOpenAIResponse(() => response)
    }
  }
  async function onAnalyse(){
    try{
      setOpenAIResponse(() => 'Loading...')
      const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if(tabs[0]?.id){
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (action : string) => {
              chrome.runtime.sendMessage({
                action,
                data: document.getSelection()?.toString(),
              });
          },
          args : [ChromeEvents.ACTION_SELECTED_TEXT]
        }); 
      }
    }catch(e){

    }
  }
    return (
       <>
        <div className="context flex gap-2 items-center">
            <p>Context</p>
            <input type="text" 
            placeholder="Enter context (Please translate it to spanish)" 
            // value={context} 
            ref={contextRef}
            // onChange={e => setContext(e.target.value)} 
            className="flex-1 pl-2 rounded-sm" 
            />
        </div>
        <button onClick={onAnalyse}>Analyse Selected Text</button>
        <p dangerouslySetInnerHTML={{__html : openAIResponse}}></p>
      </>
    );
}

export default SelectedText;