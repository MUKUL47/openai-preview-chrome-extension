import React, { useEffect, useRef, useState } from "react";
import { ChromeEvents, OpenAIConfig } from "../../types";
import { OpenAIUtil } from "../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
export default function TranscriptText({ config }: Props) {
  const contextRef = useRef<HTMLInputElement>(null);
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: any;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(onChromeEvent);
    return () => chrome.runtime.onMessage.removeListener(onChromeEvent);
  }, []);
  const onChromeEvent = (
    message: Partial<{ action: ChromeEvents; data: any }>
  ) => {
    // if (message?.action !== ChromeEvents.ACTION_ONSCROLL) return;
    analyseText(message.data);
  };

  async function analyseText(s: string) {
    if (typeof s !== "string" || !!!s) {
      setOpenAIResponse(() => {
        return { error: "No text selected..." };
      });
      return;
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
      if (response) {
        setOpenAIResponse(() => {
          return { response: response?.data || [] };
        });
      } else {
        setOpenAIResponse(() => {
          return { error: "No response detected..." };
        });
      }
      setLoading(false);
    } catch (e) {
      setOpenAIResponse(() => {
        return { error: "No response or error detected..." };
      });
      setLoading(false);
    }
  }
  async function onAnalyse() {
    try {
      setOpenAIResponse(() => {
        return { response: "<p class='text-center'>Loading...</p>" };
      });
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
          args: [ChromeEvents.ACTION_ONSCROLL],
        });
      }
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <>
      <button onClick={onAnalyse}>Convert text to image</button>
      {openAIResponse.error && (
        <p className="text-red-700 text-center">
          <strong>{openAIResponse.error}</strong>
        </p>
      )}
      {(openAIResponse.response &&
        typeof openAIResponse.response === "object" &&
        openAIResponse.response?.data?.map((v: any) => {
          return <img src={v.url} />;
        })) ||
        openAIResponse.response}
      <p></p>
    </>
  );
}
