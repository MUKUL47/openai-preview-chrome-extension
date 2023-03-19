import { useEffect } from "react";
import { ChromeEvents } from "../types";

type Props<S> = {
  chromeEvents: ChromeEvents;
  scriptParams: {
    func: (...args: any) => void;
    args: ChromeEvents[];
  };
  onResponse?: (response: S) => void;
};
export default function useModalWrapper<S = unknown>({
  chromeEvents,
  scriptParams,
  onResponse,
}: Props<S>): {
  executeScript: (tabId: number) => void;
} {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(onChromeEvent);
    return () => chrome.runtime.onMessage.removeListener(onChromeEvent);
  }, []);
  const onChromeEvent = (
    message: Partial<{ action: ChromeEvents; data: S }>
  ) => {
    if (message?.action !== chromeEvents) return;
    onResponse?.(message.data as S);
  };

  const executeScript = (tabId: number) => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: scriptParams.func,
      args: scriptParams.args,
    });
  };
  return { executeScript };
}
