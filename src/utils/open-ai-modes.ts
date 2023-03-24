import { OpenAIConfig, OpenAIModeName } from "../types";

export default [
  {
    name: OpenAIModeName.SIMPLE_QUERY,
    id: -5,
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
    name: OpenAIModeName.ANALYSE_SELECTED_TEXT,
    id: -1,
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
    id: -2,
    config: {
      n: 1,
      size: "256x256",
    },
    url: "https://api.openai.com/v1/images/generations",
    method: "POST",
  },
  {
    name: OpenAIModeName.TRANSCRIPTIONS,
    id: -3,
    config: {
      model: "whisper-1",
    },
    url: "https://api.openai.com/v1/audio/transcriptions",
    method: "POST",
    fontSizeInPx: 14.5,
  },
  {
    name: OpenAIModeName.TRANSLATIONS,
    id: -4,
    config: {
      model: "whisper-1",
    },
    url: "https://api.openai.com/v1/audio/translations",
    method: "POST",
    fontSizeInPx: 14.5,
  },
] as OpenAIConfig[];
