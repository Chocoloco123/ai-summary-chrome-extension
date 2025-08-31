<img src="src/assets/img/icon-128.png" width="64"/>

# 🌸 Text Extractor & Summarizer Chrome Extension

A beautiful, Ghibli-inspired Chrome extension that extracts text from web pages and generates AI-powered summaries using OpenAI's GPT-4o-mini model.

## ✨ Features

- **🌸 Cute Floating Button**: A cherry blossom emoji button that appears on every webpage
- **📄 Text Extraction**: Automatically extracts readable text content from any webpage
- **🤖 AI Summarization**: Uses OpenAI's GPT-4o-mini to generate intelligent summaries
- **💾 Local Storage**: Save summaries locally in your browser for later reference
- **📋 Easy Sharing**: Copy summaries to clipboard with one click
- **🎨 Beautiful UI**: Ghibli-inspired design with soft colors and smooth animations
- **⚡ Fast & Lightweight**: Minimal resource usage with efficient text processing

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher
- [Chrome Browser](https://www.google.com/chrome/)
- [OpenAI API Key](https://platform.openai.com/api-keys) (required for summarization)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd chrome-boiler
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome**

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

5. **Set up your OpenAI API Key**
   - Click the extension icon in your toolbar
   - Enter your OpenAI API key in the "OpenAI API Key" section
   - Click "Save Key"

## 🔑 OpenAI API Key Setup

### Getting Your API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated key (starts with `sk-`)

### Security Notes

- Your API key is stored locally in your browser
- It's never sent to external servers except OpenAI
- You can delete it anytime from the extension popup
- The key is used only for text summarization

### Cost Information

- Uses OpenAI's GPT-4o-mini model (very cost-effective)
- Pricing: ~$0.01 per 1K tokens
- Typical web page summaries cost less than $0.01
- You control your usage through your OpenAI account

## 📖 How to Use

### Basic Usage

1. **Enable the Extension**

   - Open the extension popup
   - Toggle the extension to "Active" (green dot)
   - The floating cherry blossom button (🌸) will appear on web pages

2. **Extract Text & Summarize**

   - Visit any webpage with text content
   - Click the floating 🌸 button on the right side
   - A dialog will open with two tabs:
     - **Full Text**: Shows all extracted text
     - **Summary**: Generates AI summary (requires API key)

3. **Save & Share**
   - In the Summary tab, click "🌟 Save Summary" to store locally
   - Click "🎨 Share" to copy to clipboard
   - View saved summaries in the extension popup

### Advanced Features

- **Toggle Extension**: Enable/disable the floating button
- **Edit API Key**: Update your OpenAI key anytime
- **View Saved Summaries**: Access all your saved summaries
- **Delete Summaries**: Remove saved summaries you no longer need

## 🎨 Design Philosophy

This extension features a **Ghibli-inspired aesthetic** with:

- Soft, warm color palette (creams, browns, greens)
- Rounded corners and gentle shadows
- Smooth animations and transitions
- Cute emoji accents (🌸, ✨, 🌟, 🎨)
- Cozy, welcoming interface

## 🛠️ Development

### Project Structure

```
src/
├── pages/
│   ├── Background/     # Background service worker
│   ├── Content/        # Content script (floating button & dialog)
│   └── Popup/          # Extension popup UI
├── assets/
│   └── img/            # Extension icons
└── manifest.json       # Extension configuration
```

### Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run dev` - Development mode with file watching

### Key Technologies

- **React 18** - Modern UI framework
- **Chrome Extension Manifest V3** - Latest extension standard
- **OpenAI API** - AI text summarization
- **Chrome Storage API** - Local data persistence
- **Webpack 5** - Modern build system

## 🔧 Configuration

### Customization Options

You can customize the extension by modifying:

- **Colors**: Update CSS variables in `src/pages/Popup/index.css` and `src/pages/Content/content.styles.css`
- **Icons**: Replace emoji icons in the content script
- **Model**: Change the OpenAI model in `src/pages/Background/index.js`
- **Styling**: Modify the Ghibli theme colors and animations

### Environment Variables

- `NODE_ENV=production` - Production build
- `PORT=6002` - Custom development server port

## 🚨 Troubleshooting

### Common Issues

1. **Extension not appearing**

   - Check if Developer mode is enabled
   - Reload the extension from `chrome://extensions/`
   - Ensure the extension is toggled to "Active"

2. **API key not working**

   - Verify your OpenAI API key is correct
   - Check your OpenAI account has credits
   - Ensure the key starts with `sk-`

3. **Summaries not generating**

   - Check your internet connection
   - Verify your OpenAI API key is saved
   - Try refreshing the page and clicking the button again

4. **Button not visible**
   - Toggle the extension off and on
   - Refresh the webpage
   - Check if the page has text content

### Getting Help

- Check the browser console for error messages
- Verify your OpenAI API key is valid
- Ensure you have sufficient OpenAI credits
- Try disabling other extensions that might conflict

## 📝 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No Tracking**: The extension doesn't collect or share your data
- **API Calls**: Only sends text content to OpenAI for summarization
- **Secure**: Uses HTTPS for all API communications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Studio Ghibli's beautiful aesthetic
- Built with Chrome Extension Manifest V3
- Powered by OpenAI's GPT-4o-mini
- Uses the Chrome Extension Boilerplate React template

---

**Made with ❤️ and lots of ✨ sparkles**

## Announcements

- Recently updated from **[React](https://reactjs.org)** ~~17~~ to **18**!
- **_This boilerplate adopts [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)!_**
  - For V2 users, please check out the [manifest-v2](https://github.com/lxieyang/chrome-extension-boilerplate-react/tree/manifest-v2) branch, or use version [3.x](https://www.npmjs.com/package/chrome-extension-boilerplate-react/v/3.3.0).
  - Check out the [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/).
- Recently added [devtools](https://developer.chrome.com/docs/extensions/mv3/devtools/) Support! Thanks [GeekaholicLin](https://github.com/lxieyang/chrome-extension-boilerplate-react/issues/17)!
- Recently updated from **[Webpack Dev Server](https://webpack.js.org/configuration/dev-server/)** ~~3.x~~ to **4.x** and **[Webpack](https://webpack.js.org/)** ~~4~~ to **5**!
- Recently added [TypeScript](https://www.typescriptlang.org/) Support!

## Features

This is a basic Chrome Extensions boilerplate to help you write modular and modern Javascript code, load CSS easily and [automatic reload the browser on code changes](https://webpack.github.io/docs/webpack-dev-server.html#automatic-refresh).

This boilerplate is updated with:

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
- [React 18](https://reactjs.org)
- [Webpack 5](https://webpack.js.org/)
- [Webpack Dev Server 4](https://webpack.js.org/configuration/dev-server/)
- [React Refresh](https://www.npmjs.com/package/react-refresh)
- [react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)

This boilerplate is heavily inspired by and adapted from [https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate), with additional support for React 18 features, Webpack 5, and Webpack Dev Server 4.

Please open up an issue to nudge me to keep the npm packages up-to-date. FYI, it takes time to make different packages with different versions work together nicely.

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **18**.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm install` to install the dependencies.
6. Run `npm start`
7. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
8. Happy hacking.

## Structure

All your extension's code must be placed in the `src` folder.

The boilerplate is already prepared to have a popup, an options page, a background page, and a new tab page (which replaces the new tab page of your browser). But feel free to customize these.

## TypeScript

This boilerplate now supports TypeScript! The `Options` Page is implemented using TypeScript. Please refer to `src/pages/Options/` for example usages.

## Webpack auto-reload and HRM

To make your workflow much more efficient this boilerplate uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) to development (started with `npm start`) with auto reload feature that reloads the browser automatically every time that you save some file in your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm run start
```

## Content Scripts

Although this boilerplate uses the webpack dev server, it's also prepared to write all your bundles files on the disk at every code change, so you can point, on your extension manifest, to your bundles that you want to use as [content scripts](https://developer.chrome.com/extensions/content_scripts), but you need to exclude these entry points from hot reloading [(why?)](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/issues/4#issuecomment-261788690). To do so you need to expose which entry points are content scripts on the `webpack.config.js` using the `chromeExtensionBoilerplate -> notHotReload` config. Look the example below.

Let's say that you want use the `myContentScript` entry point as content script, so on your `webpack.config.js` you will configure the entry point and exclude it from hot reloading, like this:

```js
{
  …
  entry: {
    myContentScript: "./src/js/myContentScript.js"
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["myContentScript"]
  }
  …
}
```

and on your `src/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["https://www.google.com/*"],
      "js": ["myContentScript.bundle.js"]
    }
  ]
}
```

## Intelligent Code Completion

Thanks to [@hudidit](https://github.com/lxieyang/chrome-extension-boilerplate-react/issues/4)'s kind suggestions, this boilerplate supports chrome-specific intelligent code completion using [@types/chrome](https://www.npmjs.com/package/@types/chrome).

## Packing

After the development of your extension run the command

```
$ NODE_ENV=production npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Secrets

If you are developing an extension that talks with some API you probably are using different keys for testing and production. Is a good practice you not commit your secret keys and expose to anyone that have access to the repository.

To this task this boilerplate import the file `./secrets.<THE-NODE_ENV>.js` on your modules through the module named as `secrets`, so you can do things like this:

_./secrets.development.js_

```js
export default { key: '123' };
```

_./src/popup.js_

```js
import secrets from 'secrets';
ApiCall({ key: secrets.key });
```

:point_right: The files with name `secrets.*.js` already are ignored on the repository.

## Resources:

- [Webpack documentation](https://webpack.js.org/concepts/)
- [Chrome Extension documentation](https://developer.chrome.com/extensions/getstarted)

---

Caroline Sarkki | [Website](https://chocoloco123.github.io/index.html)
