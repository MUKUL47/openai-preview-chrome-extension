import { useEffect, useState } from "react";
import { ChromeStorage } from "../types";
import "./Popup.css";
import PopupService from "./popup.service";
import { OpenAIUtil, Util } from "../utils";
import { ChromeStorageService } from "../utils/chrome-storage.util";
import Footer from "../shared-components/footer";
function App() {
  const [{ service }, setService] = useState<Record<string, PopupService>>({
    service: new PopupService(),
  });
  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const [configs, apiKey] = await Promise.all([
        OpenAIUtil.initializeConfigs(),
        ChromeStorageService.get<string>(ChromeStorage.OPENAI_API),
      ]);
      service.openAIConfigs = configs;
      service.selectedConfig = configs[0];
      service.hasApiKey = !!apiKey;
      if (service.hasApiKey) {
        OpenAIUtil.setAPIKey(apiKey);
      }
      setService({
        service: service.intializedService(),
      });
    } catch (e) {}
  }

  const Mode = service.GetActiveMode(service.selectedConfig!);
  return (
    <div className="flex flex-col gap-3 m-6">
      {(service.hasApiKey && (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 justify-between items-center">
              <strong>Select Mode</strong>
              <button onClick={() => chrome.runtime.openOptionsPage()}>
                Options
              </button>
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 rounded-md flex-1"
                value={service.selectedConfig?.id}
                onChange={(e) => {
                  service.selectedConfig =
                    service.openAIConfigs.find(
                      (v) => v.id === Number(e.target.value)
                    ) || null;
                  setService({ service });
                }}
              >
                {service.openAIConfigs?.map((config) => (
                  <option value={config.id} key={config.id}>
                    {Util.beautifyCamelCase(config.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(Mode && <Mode config={service.selectedConfig} />) ||
            "Mode not found..."}
        </>
      )) || (
        <InitializeOpenAIKey
          service={service}
          setService={setService}
          initialize={initialize}
        />
      )}
      <Footer />
    </div>
  );
}
function InitializeOpenAIKey({
  service,
  setService,
  initialize,
}: {
  service: PopupService;
  setService: ({ service }: { service: PopupService }) => any;
  initialize(): void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="password"
        className="p-1 rounded-sm"
        placeholder="OpenAPI Key"
        value={service.apiKeyInp}
        onChange={(e) => {
          service.apiKeyInp = e.target.value;
          setService({ service });
        }}
      />
      <button
        disabled={!service.apiKeyInp.trim().length}
        onClick={async () => {
          await ChromeStorageService.set(
            ChromeStorage.OPENAI_API,
            service.apiKeyInp
          );
          initialize();
        }}
      >
        Done
      </button>
    </div>
  );
}

export default App;
