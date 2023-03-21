import React from "react";
import * as util from "../popup/utils";
export const OpenAIUtil = util.OpenAIUtil;
export const Util = util.Util;
export const useEffect = React.useEffect;
export const useRef = React.useRef;
export const useState = React.useState;

let TranspiledCode: any = null;
let codeProps: any = {};
function TranspiledSandboxEnv() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const onMessage = ({ data }: any) => {
    console.log(data);
    try {
      setLoading(true);
      new Promise((r) => setTimeout(r, 500)).then(() => {
        const { props, jsx, func } = data;
        const t = Util.transpileJSX(jsx) || "";
        console.log(t);
        TranspiledCode = eval(t);
        console.log(TranspiledCode);
        codeProps = props;
        setLoading(false);
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (loading && <>Loading...</>) || <TranspiledCode {...codeProps} />;
}
export default TranspiledSandboxEnv;
