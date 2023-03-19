import OpenAIUtil from "./openai.util";
import { ChromeStorageService } from "./chrome-storage.util";

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
}
export { Util, OpenAIUtil, ChromeStorageService };
