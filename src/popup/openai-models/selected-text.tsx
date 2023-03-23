import React, { useRef, useState } from "react";
import { OpenAIConfig } from "../../types";
import CopyToClipboardPWrapper from "../shared-components/copy-to-clipboard";
import { OpenAIUtil, useChromeEvent, Util } from "../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
function SelectedText({ config }: Props) {
  const contextRef = useRef<HTMLInputElement>(null);
  const { executeScript } = useChromeEvent<string>({
    onChromeResponse: analyse,
  });
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: string;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  async function analyse(s: string) {
    if (typeof s !== "string" || !!!s) {
      throw "No text selected...";
    }
    try {
      const c = config.config;
      c.prompt = `${contextRef.current?.value}\n"${s}"`;
      const completion = await OpenAIUtil.getOpenAIAPI<any>(
        OpenAIUtil.getAxiosConfig(config)
      );
      const response = completion.data.choices[0].text || "";
      setOpenAIResponse(
        response ? { response } : { error: "No response detected..." }
      );
      setLoading(false);
    } catch (e) {
      setOpenAIResponse({
        error: Util.catchStringError(e, "No response detected..."),
      });
      setLoading(false);
    }
  }
  async function onAnalyse() {
    try {
      setOpenAIResponse({ response: "Loading..." });
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
    <>
      <div className="context flex gap-2 items-center">
        <p>Context</p>
        <input
          type="text"
          placeholder="Please translate it to spanish"
          ref={contextRef}
          className="flex-1 pl-2 rounded-sm"
        />
      </div>
      <button onClick={onAnalyse}>Analyse Selected Text</button>
      {openAIResponse.error && (
        <p className="text-red-700 text-center">
          <strong>{openAIResponse.error}</strong>
        </p>
      )}
      {openAIResponse.response && (
        <CopyToClipboardPWrapper
          isLoading={isLoading}
          style={OpenAIUtil.getStyle(config)}
        >
          {openAIResponse.response}
        </CopyToClipboardPWrapper>
      )}
      <p></p>
    </>
  );
}

export default SelectedText;
