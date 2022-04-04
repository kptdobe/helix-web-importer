DEPRECATED IN FAVOR OF https://github.com/kptdobe/helix-webui-importer
# Helix Web Importer

The Helix Web Importer is a tool to transform the current page DOM from HTML to Markdown and docx.

## Local setup

```
npm i
npm run start
```

This will package everything and start a local web server. Entry point to the helix-web-importer is [http://localhost:8080/app.js]().

## Bookmarklet

Once started, you need the following bookmarklet to load the Helix Web Importer into the current page:

```
javascript: { const script = document.createElement('script'); script.setAttribute('src', `http://localhost:8080/app.js`); script.setAttribute('type', 'text/javascript'); script.setAttribute('id', 'hlx-importer-app'); document.head.appendChild(script); }
```

This should provide a default transformation to the current page.

You can pass in some custom options like:

```
javascript: { const config = { importFileURL: 'http://localhost:3000/tools/importer/import.js' }; const script = document.createElement('script'); script.setAttribute('data-config',JSON.stringify(config)); script.setAttribute('src', `http://localhost:8080/app.js`); script.setAttribute('type', 'text/javascript'); script.setAttribute('id', 'hlx-importer-app'); document.head.appendChild(script); }
```

In this example, `importFileURL` config is the default one used but can be changed to something else.

## importer script

In order to customize the transformation, just run `hlx up` in your project and create the `/tools/importer/import.js` file. Default / example skeleton:

```
export default {
  transformDOM: (document) => {
    return document.body;
  },

  generateDocumentPath: (url, document) => {
    return new URL(url).pathname.replace(/\/$/, '');
  },
}
```

You can now adjust the transformDOM method to remove / add DOM elements and return the DOM container to transform to Markdown.