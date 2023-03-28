import { useEffect, useRef } from "react";
interface Props<T extends any> {
  getApi: (blob: Blob) => Promise<T>;
  onUpdate?: (transcripts: string[]) => void;
  parseResponse: (r: T) => string;
  audioInterval?: number;
}
let transcriptions: string[] = [];
let AUDIO_INTERVAL = 1500;
const MUTED_CHUNK = 1.75;
const useTabCaptureAudio = <T>({
  getApi,
  onUpdate,
  parseResponse,
  audioInterval,
}: Props<T>) => {
  const intervalRef = useRef<number>(-1);
  const audioTimeoutref = useRef<number>(-1);
  const audioIntervalref = useRef<number>(AUDIO_INTERVAL);

  const updateTranscript = (s: string, c: number) => {
    transcriptions[c] = s.trim();
    const filteredTranscripts = transcriptions.filter(String);
    filteredTranscripts[filteredTranscripts.length - 1] = `<strong>${
      filteredTranscripts[filteredTranscripts.length - 1]
    }</strong>`;
    onUpdate?.(transcriptions);
  };
  useEffect(() => {
    transcriptions = [];
    AUDIO_INTERVAL = audioInterval || 1500;
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(audioTimeoutref.current);
    };
  }, []);

  const startRecording = () => {
    chrome.tabCapture.capture({ audio: true }, function (stream: any) {
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
            getApi(blob)
              .then((r) => updateTranscript(parseResponse(r), count))
              .catch(() => updateTranscript("", count));
          });
        };
        saveRecording(intervalCount++);
      }, audioIntervalref.current);
      source.connect(audioContext.destination);
    });
  };
  return [
    () => {
      transcriptions = [];
      onUpdate?.(transcriptions);
    },
    startRecording,
    stop,
  ];
};

export default useTabCaptureAudio;
