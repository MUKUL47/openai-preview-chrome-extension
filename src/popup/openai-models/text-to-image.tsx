import React, { useEffect, useState } from "react";
import { OpenAIConfig } from "../../types";
import PopupService from "../popup.service";
import LoadingComponent from "../shared-components/loading-component";
import { OpenAIUtil } from "../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
export default function TextToImage({ config }: Props) {
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: any;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(onChromeEvent);
    return () => chrome.runtime.onMessage.removeListener(onChromeEvent);
  }, []);
  const onChromeEvent = (message: Partial<{ action: string; data: any }>) => {
    if (message.action !== PopupService.getPopupChromeEventId()) return;
    analyse(message.data);
  };

  async function analyse(s: string) {
    if (typeof s !== "string" || !!!s) {
      return setOpenAIResponse({ error: "No text selected..." });
    }
    try {
      const completionConfig = OpenAIUtil.defaultConfigs[0];
      completionConfig.config.prompt = `Summarize in less than 10 words\n"${s}"`;
      const completion = await OpenAIUtil.getOpenAIAPI<any>(
        OpenAIUtil.getAxiosConfig(completionConfig)
      );
      config.config.prompt = completion.data.choices[0].text || "No Text Found";
      const response = await OpenAIUtil.getOpenAIAPI<any>(
        OpenAIUtil.getAxiosConfig(config)
      );
      setOpenAIResponse(
        (response && { response: response?.data || [] }) || {
          error: "No response detected...",
        }
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setOpenAIResponse({ error: "No response or error detected..." });
    }
  }
  async function onAnalyse() {
    try {
      setLoading(true);
      const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (action: string) => {
            chrome.runtime.sendMessage({
              action,
              data: document.getSelection()?.toString(),
            });
          },
          args: [PopupService.getPopupChromeEventId()],
        });
      }
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <LoadingComponent isLoading={isLoading}>
      <div className="flex flex-col gap-2">
        <button onClick={onAnalyse}>Convert text to image</button>
        {openAIResponse.error && (
          <p className="text-red-700 text-center">
            <strong>{openAIResponse.error}</strong>
          </p>
        )}
        {(openAIResponse.response &&
          typeof openAIResponse.response === "object" &&
          openAIResponse.response?.data?.map((v: any) => {
            return <img src={v.url} className="w-full" />;
          })) ||
          openAIResponse.response}
      </div>
    </LoadingComponent>
  );
}
