import React, { useState } from "react";
import { OpenAIUtil, Util } from "../../utils";
import { OpenAIConfig } from "../../types";
interface Props
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  openAIConfig: OpenAIConfig;
  onUpdate: () => void;
}
type OpenAIConfigEdit = Omit<OpenAIConfig, "config" | "axiosConfig"> & {
  config: string;
  axiosConfig: string;
};
const INPUT_CLASS = "flex-1 p-2 rounded-md w-full";
const EditConfig = ({ openAIConfig, onUpdate }: Props) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [config, setConfig] = useState<OpenAIConfigEdit>(
    transformEditConfig(openAIConfig)
  );
  function transformEditConfig(config: OpenAIConfig): OpenAIConfigEdit {
    return {
      ...config,
      config: Util.transformRecordToStr(config.config),
      axiosConfig: Util.transformRecordToStr(config?.axiosConfig || {}),
    };
  }
  const onResetOriginal = async () => {
    const originalconfigs = await OpenAIUtil.getConfigs(true);
    const originalconfig = originalconfigs.find((v) => v.id === config.id);
    if (!originalconfig) return;
    await OpenAIUtil.updateConfigs(originalconfig);
    setConfig(transformEditConfig(originalconfig));
  };
  const onReset = () => {
    setConfig(transformEditConfig(openAIConfig));
  };
  const getAndUpdate = (key: keyof OpenAIConfig) => {
    return {
      value: `${config[key] ?? ""}`,
      onChange: (e: { target: { value: any } }) => {
        setConfig({ ...config, [key]: e.target.value });
      },
    };
  };
  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setUpdating(true);
      const newConfig: OpenAIConfig = {
        ...config,
        config: Util.transformStrToObj(config.config),
        axiosConfig: Util.transformStrToObj(config.axiosConfig),
      };
      if (config.axiosConfig.length === 0) {
        delete newConfig.axiosConfig;
      }
      await OpenAIUtil.updateConfigs(newConfig);
      onUpdate();
    } catch (e) {
      setUpdating(false);
    }
  };

  const preventDefault = (fn: Function) => {
    return (e: any) => {
      e.preventDefault();
      fn.apply(null);
    };
  };
  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        <InputWrapper label="Mode Name">
          <input
            required
            {...getAndUpdate("name")}
            type="text"
            className={INPUT_CLASS}
            placeholder={"Mode Name"}
          />
        </InputWrapper>
        <InputWrapper label="OpenAI Config">
          <textarea
            {...getAndUpdate("config")}
            required
            className={INPUT_CLASS}
          />
        </InputWrapper>
        <InputWrapper label="API Url">
          <input
            required
            {...getAndUpdate("url")}
            type="text"
            className={INPUT_CLASS}
            placeholder="API Url"
          />
        </InputWrapper>
        <InputWrapper label="Font Size">
          <input
            {...getAndUpdate("fontSizeInPx")}
            type="text"
            className={INPUT_CLASS}
            placeholder="Font Size"
          />
        </InputWrapper>
        <InputWrapper label="Option Axios Config">
          <textarea
            placeholder="Option Axios Config"
            className={INPUT_CLASS}
            {...getAndUpdate("axiosConfig")}
          />
        </InputWrapper>
      </div>
      <div className="flex gap-4 mt-3">
        <button disabled={updating}>
          {(updating && "Updating...") || "Update"}
        </button>
        <button onClick={preventDefault(onReset)}>Reset</button>
        <button onClick={preventDefault(onResetOriginal)}>
          Reset to original config
        </button>

        <button
          onClick={preventDefault(onUpdate)}
          className="bg-red-800 text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
function InputWrapper(props: any) {
  return (
    <div className="flex gap-1 flex-col">
      <label className="flex-1 text-left">{props.label}</label>
      {props.children}
    </div>
  );
}
export default EditConfig;