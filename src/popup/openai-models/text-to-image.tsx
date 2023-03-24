import React, { useState } from "react";
import { OpenAIConfig, OpenAIModeName } from "../../types";
import LoadingComponent from "../shared-components/loading-component";
import { OpenAIUtil, useChromeEvent, Util } from "../../utils";
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
  const { executeScript } = useChromeEvent<string>({
    onChromeResponse: analyse,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [preCondition, setPrecondition] = useState<string>(
    "Summarize in less than 10 words"
  );

  async function analyse(s: string) {
    try {
      if (typeof s !== "string" || !!!s) {
        throw "No text selected...";
      }
      const completionConfig = OpenAIUtil.defaultConfigs.find(
        (v) => v.name === OpenAIModeName.ANALYSE_SELECTED_TEXT
      );
      if (!completionConfig) throw new Error("Oops! default config missing");
      completionConfig.config.prompt = `${preCondition.trim()}\n"${s}"`;
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
      setOpenAIResponse({
        error: Util.catchStringError(e, "No response or error detected..."),
      });
    }
  }
  async function onAnalyse() {
    try {
      setLoading(true);
      executeScript((action: string) => {
        chrome.runtime.sendMessage({
          action,
          data: document.getSelection()?.toString(),
        });
      });
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <LoadingComponent isLoading={isLoading}>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="p-1 rounded-sm w-full"
          value={preCondition}
          onChange={(e) => setPrecondition(e.target.value)}
        />
        <button onClick={onAnalyse} disabled={preCondition.trim().length === 0}>
          Convert selected text to image
        </button>
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
