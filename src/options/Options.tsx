import { useEffect, useState } from "react";
import { ChromeStorageService } from "../utils";
import { ChromeStorage, OpenAIConfig } from "../types";
import EditConfig from "./components/edit-config";
import Configs from "./components/option-configs";
export default function App() {
  const [editMode, setEditMode] = useState<OpenAIConfig | null>(null);
  const [key, setKey] = useState<string>("");
  useEffect(() => {
    ChromeStorageService.get<string>(ChromeStorage.OPENAI_API).then(setKey);
  }, []);
  const onUpdateAPIKey = () => {
    ChromeStorageService.set(ChromeStorage.OPENAI_API, key);
  };
  return (
    <div className="flex flex-col gap-5 w-11/12 m-auto my-20 md:w-4/5">
      <div className="flex flex-col gap-2 items-start">
        <p className="items-center w-full text-6xl mb-10 text-center font-sans">
          Options
        </p>
        <div className="flex gap-2 w-full items-center p-3 rounded-md bg-slate-500">
          <label htmlFor="">API Key</label>
          <input
            type="password"
            className="flex-1 p-2 rounded-md"
            placeholder="Enter your OpenAI api key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button disabled={key.trim().length === 0} onClick={onUpdateAPIKey}>
            Save
          </button>
        </div>
      </div>
      {!editMode ? (
        <Configs onEdit={setEditMode} />
      ) : (
        <div className="flex flex-col gap-2 p-3 rounded-md bg-slate-600">
          <p className="text-3xl">Edit Mode</p>
          <EditConfig
            openAIConfig={editMode}
            onUpdate={() => setEditMode(null)}
          />
        </div>
      )}
      <footer>
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/mukul-dutt/"
          target="_blank"
          rel="noreferrer"
        >
          Mukul
        </a>
      </footer>
    </div>
  );
}
