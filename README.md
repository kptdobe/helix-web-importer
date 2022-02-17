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