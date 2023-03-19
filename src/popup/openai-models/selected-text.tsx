import React, { useEffect, useRef, useState } from "react";
import { ChromeEvents, OpenAIConfig } from "../../types";
import { OpenAIUtil, Util } from "../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  config: OpenAIConfig;
}
function SelectedText({ config }: Props) {
  const contextRef = useRef<HTMLInputElement>(null);
  const [openAIResponse, setOpenAIResponse] = useState<{
    error?: string;
    response?: string;
  }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(onChromeEvent);
    // chrome.tabCapture.capture(
    //   { audio: true, video: false },
    //   function (stream: any) {
    //     var audioContext = new AudioContext();

    //     // Create a new MediaStreamAudioSourceNode and connect it to the stream
    //     var source = audioContext.createMediaStreamSource(stream);

    //     // Create a new AnalyserNode to analyze the audio data
    //     var analyser = audioContext.createAnalyser();
    //     analyser.fftSize = 2048;

    //     // Connect the source to the analyser and the analyser to the destination
    //     source.connect(analyser);
    //     analyser.connect(audioContext.destination);

    //     // Get the frequency data from the analyser and log it to the console
    //     var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    //     setInterval(function () {
    //       analyser.getByteFrequencyData(frequencyData);
    //       console.log(frequencyData);
    //     }, 1000);
    //   }
    // );
    return () => chrome.runtime.onMessage.removeListener(onChromeEvent);
  }, []);
  const onChromeEvent = (
    message: Partial<{ action: ChromeEvents; data: any }>
  ) => {
    if (message?.action !== ChromeEvents.ACTION_SELECTED_TEXT) return;
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
      const c = config.config;
      c.prompt = `${contextRef.current?.value}\n"${s}"`;
      const completion = await OpenAIUtil.getOpenAIAPI<any>(
        OpenAIUtil.getAxiosConfig(config)
      );
      const response = completion.data.choices[0].text || "";
      if (response) {
        setOpenAIResponse(() => {
          return { response };
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
          args: [ChromeEvents.ACTION_SELECTED_TEXT],
        });
      }
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
        <>
          <p
            className={Util.class(!isLoading && "cursor-pointer")}
            title={(!isLoading && "copy to clipboard") || ""}
            onClick={() => {
              if (isLoading) return;
              !!openAIResponse.response &&
                navigator.clipboard.writeText(openAIResponse.response);
            }}
            dangerouslySetInnerHTML={{ __html: openAIResponse.response }}
          ></p>
        </>
      )}
      <p></p>
    </>
  );
}

export default SelectedText;
