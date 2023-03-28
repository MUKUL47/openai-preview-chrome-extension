import React, { useEffect, useRef } from "react";
import { OpenAIConfig } from "../../../types";
import { OpenAIUtil } from "../../../utils";
import useTabCaptureAudio from "../../../utils/use-tabcapture-audio";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
export default function TranscriptionAudio({ config }: Props) {
  const transcriptionsRef = useRef<HTMLDivElement>(null);
  const [clear, start] = useTabCaptureAudio<{
    data: {
      text: string;
    };
  }>({
    getApi,
    parseResponse: (r) => r.data?.text || "",
    onUpdate: (transcripts: string[]) => {
      if (!transcriptionsRef.current) return;
      transcriptionsRef.current.innerHTML = transcripts.join(" ");
    },
    audioInterval: 2200,
  });
  useEffect(() => {
    start();
  }, []);
  function getApi(blob: Blob) {
    config.config["file"] = new File([blob], "audio.mp3", {
      type: "audio/mp3",
    });
    const form = new FormData();
    form.append("file", config.config["file"]);
    form.append("model", config.config.model);
    const options = {
      ...OpenAIUtil.getAxiosConfig(config),
      data: form,
      headers: {
        Authorization: `Bearer ${OpenAIUtil.getApiKey()}`,
      },
    };
    return OpenAIUtil.getOpenAIAPI<{
      data: {
        text: string;
      };
    }>(options);
  }
  return (
    <div className="flex flex-col gap-2">
      <button onClick={clear}>Clear</button>
      <div ref={transcriptionsRef} style={OpenAIUtil.getStyle(config)}>
        <strong className="underline italic">Listening...</strong>
      </div>
    </div>
  );
}
