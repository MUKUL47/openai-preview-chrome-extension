import { useEffect, useMemo } from "react";
import PopupService from "../popup/popup.service";

type Props<S> = {
  onChromeResponse?: (response: S) => void;
};
export default function useChromeEvent<S extends unknown>({
  onChromeResponse,
}: Props<S>): {
  executeScript: (chromeScriptFunc: (id: string) => any) => void;
} {
  const chromeEventId = useMemo(() => PopupService.getPopupChromeEventId(), []);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(onChromeEvent);
    return () => chrome.runtime.onMessage.removeListener(onChromeEvent);
  }, []);

  const onChromeEvent = (message: Partial<{ action: string; data: S }>) => {
    if (message.action !== chromeEventId) return;
    onChromeResponse?.(message.data as S);
  };

  const executeScript = async (chromeScriptFunc: (id: string) => any) => {
    const tabs = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (!tabs[0]?.id) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: chromeScriptFunc,
      args: [chromeEventId],
    });
  };
  return { executeScript };
}
