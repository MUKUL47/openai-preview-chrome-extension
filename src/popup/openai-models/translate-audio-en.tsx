import React, { useEffect, useRef } from "react";
import { OpenAIConfig } from "../../types";
import { OpenAIUtil } from "../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
let transcriptions: string[] = [];
const MUTED_CHUNK = 1.75;
let STREAM: any = null;
const AUDIO_INTERVAL = 1000;
export default function TranslateAudioEn({ config }: Props) {
  const intervalRef = useRef<number>(-1);
  const audioTimeoutref = useRef<number>(-1);
  const transcriptionsRef = useRef<HTMLDivElement>(null);
  const audioIntervalref = useRef<number>(AUDIO_INTERVAL);
  const getApiConfig = (form: FormData) => {
    return {
      ...OpenAIUtil.getAxiosConfig(config),
      data: form,
      headers: {
        Authorization: `Bearer ${OpenAIUtil.getApiKey()}`,
      },
    };
  };
  useEffect(() => {
    startRecording();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(audioTimeoutref.current);
      STREAM?.getTracks?.()?.forEach((track: any) => track?.stop?.());
    };
  }, []);

  const updateTranscript = (s: string, c: number) => {
    transcriptions[c] = s.trim();
    if (transcriptionsRef.current) {
      const filteredTranscripts = transcriptions.filter(String);
      filteredTranscripts[filteredTranscripts.length - 1] = `<strong>${
        filteredTranscripts[filteredTranscripts.length - 1]
      }</strong>`;
      transcriptionsRef.current.innerHTML = filteredTranscripts.join(" ");
    }
  };
  const startRecording = () => {
    chrome.tabCapture.capture({ audio: true }, function (stream: any) {
      STREAM = stream;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      let intervalCount = 0;
      intervalRef.current = setInterval(() => {
        const saveRecording = (count: number) => {
          const recorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];
          recorder.start();
          audioTimeoutref.current = setTimeout(
            () => recorder.stop(),
            audioIntervalref.current
          );
          recorder.addEventListener("dataavailable", (event) =>
            chunks.push(event.data)
          );
          recorder.addEventListener("stop", function () {
            const blob = new Blob(chunks, { type: "audio/mp3" });
            if (blob.size <= MUTED_CHUNK * audioIntervalref.current) return;
            updateTranscript("[...]", count);
            config.config["file"] = new File([blob], "audio.mp3", {
              type: "audio/mp3",
            });
            const form = new FormData();
            form.append("file", config.config["file"]);
            form.append("model", config.config.model);
            OpenAIUtil.getOpenAIAPI<{
              data: {
                text: string;
              };
            }>(getApiConfig(form))
              .then((response) => {
                updateTranscript(response.data.text, count);
              })
              .catch(() => {
                updateTranscript("", count);
              });
          });
        };
        saveRecording(intervalCount++);
      }, audioIntervalref.current);
      source.connect(audioContext.destination);
    });
  };
  const clearTranscript = () => {
    transcriptions = [];
    if (transcriptionsRef.current) {
      transcriptionsRef.current.innerHTML = `<strong className="underline italic">Translating...</strong>`;
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <button onClick={clearTranscript}>Clear</button>
      <div ref={transcriptionsRef} style={OpenAIUtil.getStyle(config)}>
        <strong className="underline italic">Translating...</strong>
      </div>
    </div>
  );
}
