import React, { useState } from "react";
import { OpenAIUtil, Util } from "../../popup/utils";
import { OpenAIConfig } from "../../types";
interface Props
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  openAIConfig: OpenAIConfig;
}
type OpenAIConfigEdit = Omit<OpenAIConfig, "config" | "axiosConfig"> & {
  config: string;
  axiosConfig: string;
};
const EditConfig = ({ openAIConfig }: Props) => {
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
  const onReset = () => {
    setConfig(transformEditConfig(openAIConfig));
  };
  const getAndUpdate = (key: keyof OpenAIConfig) => {
    return {
      value: `${config[key]}`,
      onChange: (e: { target: { value: any } }) => {
        setConfig({ ...config, [key]: e.target.value });
      },
    };
  };
  const onSubmit = async (e: any) => {
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
    setUpdating(false);
  };
  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <InputWrapper label="Enter Name">
          <input
            required
            {...getAndUpdate("name")}
            type="text"
            className="flex-1 p-1 rounded-sm pl-2"
            placeholder={"Enter Name"}
          />
        </InputWrapper>
        <InputWrapper label="OpenAI Config">
          <textarea
            {...getAndUpdate("config")}
            required
            placeholder="Enter OpenAI mode config"
            className="w-full"
          />
        </InputWrapper>
        <InputWrapper label="API Url">
          <input
            required
            {...getAndUpdate("url")}
            type="text"
            className="flex-1 p-1 rounded-sm pl-2"
            placeholder="API Url"
          />
        </InputWrapper>
        <InputWrapper label="Font Size">
          <input
            {...getAndUpdate("fontSizeInPx")}
            type="text"
            className="flex-1 p-1 rounded-sm pl-2"
            placeholder="Font Size"
          />
        </InputWrapper>
        <InputWrapper label="Option Axios Config">
          <textarea
            placeholder="Option Axios Config"
            className="w-full"
            {...getAndUpdate("axiosConfig")}
          />
        </InputWrapper>
      </div>
      <div className="flex gap-2">
        <button disabled={updating}>
          {(updating && "Updating...") || "Update"}
        </button>
        <input type="button" onClick={onReset} value="Reset" />
      </div>
    </form>
  );
};
function InputWrapper(props: any) {
  return (
    <div className="flex gap-2 flex-col">
      <label className="flex-1 text-left">{props.label}</label>
      {props.children}
    </div>
  );
}
export default EditConfig;
