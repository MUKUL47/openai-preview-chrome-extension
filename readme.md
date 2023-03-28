# Open AI - Preview

Open AI - Preview is a Chrome extension that allows you to interact with the browser in different modes, including:

- **Ask Query:** Allows you to any question to OpenAI.
- **Context Selection Mode:** Allows you to select text on the webpage and get related information from OpenAI's GPT-3 model.
- **Image Creation Mode:** Allows you to generate images from selected text using OpenAI's DALL-E model.
- **Realtime Transcription Mode:** Allows you to get real-time transcriptions of running audio using OpenAI's API.
- **Translation / Transcript Mode:** Allows you to translate & transcript audio to text using OpenAI's GPT-3 whisper-3 model.

To use the extension, you will need to provide your OpenAI API key in the options page. Additionally, the extension includes options to provide custom payload for specific models.

## Permissions

Open AI - Preview requires the following permissions:

- `tabs`: Used to query and interact with the current tab.
- `activeTab`: Used to capture selected text on the current tab.
- `storage`: Used to store and retrieve user preferences and options.
- `declarativeContent`: Used to add rules that can take actions, such as showing a page action, based on the content of a page.
- `tabCapture`: Used to capture the contents of a tab in image or video form.
- `audioCapture`: Used to capture audio for the realtime transcription mode.
- `scripting`: Used to run JavaScript code in the context of a page, which is necessary for some modes of the extension.

## Installation

To install the extension, follow these steps:

1. Clone the repository or download the source code.
2. Open Google Chrome and navigate to the extensions settings page (`chrome://extensions`).
3. Enable developer mode.
4. Click on "Load unpacked" and select the `build` folder of the extension.
5. The extension should now be installed and available in Chrome.

## Usage

To use the extension, simply activate it by clicking on the extension icon in your Chrome toolbar. From there, select the desired mode and follow the prompts to interact with the browser.

## Contributing

Please feel free to contribute or add more OpenAI models to this extension. We welcome pull requests and suggestions.
