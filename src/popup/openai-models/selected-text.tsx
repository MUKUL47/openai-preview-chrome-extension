import React, { useRef, useState } from "react";
import { OpenAIConfig } from "../../types";
import CopyToClipboardPWrapper from "../../shared-components/copy-to-clipboard";
import { OpenAIUtil, useChromeEvent, Util } from "../../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
function SelectedText({ config }: Props) {
  const contextRef = useRef<HTMLTextAreaElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { executeScript } = useChromeEvent<string>({
    onChromeResponse: analyse,
  });
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [textArea, setTextArea] = useState<string>("");
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: string;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  async function analyse(s: string) {
    try {
      const isChecked = checkboxRef.current?.checked;
      if (isChecked && s.trim().length === 0) throw "No selected text found";
      const c = config.config;
      c.prompt =
        (!!isChecked && `${contextRef.current?.value}\n"${s}"`) ||
        contextRef.current?.value;
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
        <textarea
          placeholder={
            checkbox
              ? "Please translate it to spanish"
              : "Tell me creative birthday ideas!"
          }
          ref={contextRef}
          value={textArea}
          onChange={(e) => setTextArea(e.target.value)}
          className="flex-1 pl-2 rounded-sm"
        />
      </div>
      <div className="flex gap-2 items-center">
        <label>Consider Selected Text</label>
        <input
          type="checkbox"
          ref={checkboxRef}
          checked={checkbox}
          onChange={(e) => setCheckbox(e.target.checked)}
        />
      </div>
      <button onClick={onAnalyse} disabled={textArea.trim().length === 0}>
        Submit
      </button>
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
    </>
  );
}

export default SelectedText;
