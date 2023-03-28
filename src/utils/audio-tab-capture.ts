interface Props<T extends any> {
  getApi: (blob: Blob) => Promise<T>;
  onUpdate?: (transcripts: string[]) => void;
  parseResponse: (r: T) => string;
}

class TabCaptureAudio<T> {
  private transcriptions: string[] = [];
  private stream: any = null;
  private readonly audioInterval = 1000;
  private readonly mutedChunk = 1.75;
  private intervalRef: number = -1;
  private audioTimeoutRef: number = -1;
  private audioIntervalRef: number = this.audioInterval;

  constructor(private readonly props: Props<T>) {}

  private updateTranscript(s: string, c: number): void {
    this.transcriptions[c] = s.trim();
    const filteredTranscripts = this.transcriptions.filter(Boolean);
    filteredTranscripts[filteredTranscripts.length - 1] = `<strong>${
      filteredTranscripts[filteredTranscripts.length - 1]
    }</strong>`;
    this.props.onUpdate?.(this.transcriptions);
  }

  private startRecording(): void {
    chrome.tabCapture.capture({ audio: true }, (stream: any) => {
      this.stream = stream;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      let intervalCount = 0;
      this.intervalRef = setInterval(() => {
        const saveRecording = (count: number) => {
          const recorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];
          recorder.start();
          this.audioTimeoutRef = setTimeout(
            () => recorder.stop(),
            this.audioIntervalRef
          );
          recorder.addEventListener("dataavailable", (event) =>
            chunks.push(event.data)
          );
          recorder.addEventListener("stop", () => {
            const blob = new Blob(chunks, { type: "audio/mp3" });
            if (blob.size <= this.mutedChunk * this.audioIntervalRef) return;
            this.updateTranscript("[...]", count);
            this.props
              .getApi(blob)
              .then((r) =>
                this.updateTranscript(this.props.parseResponse(r), count)
              )
              .catch(() => this.updateTranscript("", count));
          });
        };
        saveRecording(intervalCount++);
      }, this.audioIntervalRef);
      source.connect(audioContext.destination);
    });
  }

  public start(): void {
    this.transcriptions = [];
    this.stream = null;
    this.startRecording();
  }

  public stop(): void {
    clearInterval(this.intervalRef);
    clearTimeout(this.audioTimeoutRef);
    this.stream?.getTracks?.()?.forEach((track: any) => track?.stop?.());
  }

  public reset(): void {
    this.transcriptions = [];
    this.props.onUpdate?.(this.transcriptions);
  }
}

export default TabCaptureAudio;
