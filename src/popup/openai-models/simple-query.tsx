import React, { useState } from "react";
import { OpenAIConfig } from "../../types";
import CopyToClipboardPWrapper from "../shared-components/copy-to-clipboard";
import { OpenAIUtil } from "../../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
function SimpleQuery({ config }: Props) {
  const [query, setQuery] = useState<string>(
    "Tell me creative birthday ideas!"
  );
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: string;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);

  async function askQuery() {
    try {
      setOpenAIResponse({ response: "Loading..." });
      const c = config.config;
      c.prompt = query.trim();
      const completion = await OpenAIUtil.getOpenAIAPI<any>(
        OpenAIUtil.getAxiosConfig(config)
      );
      const response = completion.data.choices[0].text || "";
      setOpenAIResponse(
        response ? { response } : { error: "No response detected..." }
      );
      setLoading(false);
    } catch (e) {
      setOpenAIResponse({ error: "No response detected..." });
      setLoading(false);
    }
  }
  return (
    <>
      <div className="context flex gap-2 items-center">
        <textarea
          placeholder="Tell me creative birthday ideas!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pl-2 rounded-sm w-full"
        />
      </div>
      <button onClick={askQuery} disabled={query.trim().length === 0}>
        Ask simple query
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
      <p></p>
    </>
  );
}

export default SimpleQuery;
