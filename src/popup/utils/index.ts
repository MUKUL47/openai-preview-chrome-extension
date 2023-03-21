import ts from "typescript";
import { ChromeStorageService } from "./chrome-storage.util";
import OpenAIUtil from "./openai.util";

class Util {
  public static class(
    ...s: (undefined | null | boolean | string | number)[]
  ): string {
    return s
      .filter((v) => typeof v === "string" && !!v.trim().length)
      .join(" ");
  }
  public static beautifyCamelCase(v: string): string {
    return v
      .split(/_|-| /g)
      .map((s) => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`)
      .join(" ");
  }
  public static evalulateJS(js: string): any {
    try {
      return eval(js);
    } catch (e) {
      console.error(e);
    }
  }
  public static transpileJSX(jsx: string): string | null {
    const transpiled = ts.transpileModule(jsx, {
      compilerOptions: { jsx: ts.JsxEmit.React, strictFunctionTypes: false },
    });
    console.log(transpiled);
    return transpiled?.outputText ? transpiled.outputText : null;
  }
}
export { Util, OpenAIUtil, ChromeStorageService };
