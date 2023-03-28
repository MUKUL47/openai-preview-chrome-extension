import { useEffect, useState } from "react";
import { OpenAIConfig } from "../../../types";
import TranscriptionAudio from "./transcriptions-audio";

export default function AudioMode({
  config,
}: {
  config: OpenAIConfig;
  tabId: number;
}) {
  const [loading, setLoading] = useState<any>(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      setLoading(false);
    })();
  }, [config.name]);
  return loading ? null : <TranscriptionAudio config={config} />;
}
