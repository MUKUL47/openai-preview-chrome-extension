import ts from "typescript";
import { ChromeStorageService } from "./chrome-storage.util";
import openAIModes from "./open-ai-modes";
import OpenAIUtil from "./openai.util";
import useChromeEvent from "./use-chrome-event";
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
  public static catchStringError(e: any, defaultError: string): string {
    return (typeof e === "string" && e) || defaultError;
  }
  public static transpileJSX(jsx: string): string | null {
    const transpiled = ts.transpileModule(jsx, {
      compilerOptions: { jsx: ts.JsxEmit.React, strictFunctionTypes: false },
    });
    return transpiled?.outputText ? transpiled.outputText : null;
  }
}

export { Util, OpenAIUtil, ChromeStorageService, openAIModes, useChromeEvent };
