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
  public static transformRecordToStr(obj: Record<any, any>): string {
    return Object.entries(obj)
      .reduce<string[]>((a: string[], c: Array<any>) => {
        return [...a, `${c[0]}=${c[1]}`];
      }, [])
      .join(` ; `);
  }

  public static JSONParse<T extends unknown>(s: string): T | null {
    try {
      return JSON.parse(s) as T;
    } catch (e) {
      return null;
    }
  }

  public static transformStrToObj(str: string): Record<any, any> | null {
    try {
      return str.split(";").reduce<Record<string, any>>((a, c) => {
        if (c.trim().length === 0) return a;
        const [k, v] = c.split("=");
        const val = !isNaN(Number(v)) ? Number(v) : v.trim();
        return { ...a, [k.trim()]: val };
      }, {});
    } catch (e) {
      return null;
    }
  }
  public static transpileJSX(jsx: string): string | null {
    const transpiled = ts.transpileModule(jsx, {
      compilerOptions: { jsx: ts.JsxEmit.React, strictFunctionTypes: false },
    });
    return transpiled?.outputText ? transpiled.outputText : null;
  }
}

export { Util, OpenAIUtil, ChromeStorageService, openAIModes, useChromeEvent };
