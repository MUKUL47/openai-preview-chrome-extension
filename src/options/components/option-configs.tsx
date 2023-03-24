import { useEffect, useState } from "react";
import { OpenAIUtil, Util } from "../../utils";
import { OpenAIConfig } from "../../types";
interface Props {
  onEdit: (config: OpenAIConfig) => void;
}
const Configs = ({ onEdit }: Props) => {
  const [openAIConfigs, SetOpenAIConfigs] = useState<OpenAIConfig[]>([]);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    SetOpenAIConfigs(await OpenAIUtil.initializeConfigs());
  };
  return (
    <table className="w-full border border-gray-300 rounded-lg">
      <tbody>
        <tr className="h-1/2">
          <td className="bg-blue-700 px-4 py-2 text-center text-white">Mode</td>
          <td className="bg-blue-700 px-4 py-2 text-center w-1/2 text-white"></td>
        </tr>
        {openAIConfigs.map((config) => {
          return (
            <tr className="h-1/2" key={config.id}>
              <td className="bg-gray-400 px-4 py-2 text-center text-black">
                {Util.beautifyCamelCase(config.name)}
              </td>
              <td className="bg-gray-400 px-4 py-2 text-center w-1/2">
                <div className="flex gap-2 items-center justify-center">
                  <button
                    className="rounded-sm bg-gray-600-800 text-white"
                    onClick={() => onEdit(config)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Configs;
