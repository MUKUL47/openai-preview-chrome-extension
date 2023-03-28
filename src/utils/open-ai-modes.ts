import { OpenAIConfig, OpenAIModeName } from "../types";

export default [
  {
    name: OpenAIModeName.ANALYSE_SELECTED_TEXT,
    isDefault: true,
    config: {
      model: "text-davinci-003",
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    url: "https://api.openai.com/v1/completions",
    method: "POST",
    fontSizeInPx: 16,
  },
  {
    name: OpenAIModeName.TEXT_TO_IMAGE,
    config: {
      n: 1,
      size: "256x256",
    },
    url: "https://api.openai.com/v1/images/generations",
    method: "POST",
  },
  {
    name: OpenAIModeName.TRANSCRIPTIONS,
    config: {
      model: "whisper-1",
    },
    url: "https://api.openai.com/v1/audio/transcriptions",
    method: "POST",
    fontSizeInPx: 14.5,
  },
  {
    name: OpenAIModeName.TRANSLATIONS,
    config: {
      model: "whisper-1",
    },
    url: "https://api.openai.com/v1/audio/translations",
    method: "POST",
    fontSizeInPx: 14.5,
  },
] as OpenAIConfig[];
