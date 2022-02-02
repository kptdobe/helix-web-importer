import {
  PageImporter,
  PageImporterResource,
  DOMUtils,
  Blocks,
  MemoryHandler,
} from '@adobe/helix-importer';

import docxStylesXML from './styles.xml';

async function html2x(url, html, transformCfg, toMd, toDocx) {
  class InternalImporter extends PageImporter {
    async fetch() {
      return new Response(html);
    }

    async process(document) {
      let output = document.body;
      if (transformCfg && transformCfg.transformDOM) {
        output = transformCfg.transformDOM(document);
      }
      const pir = new PageImporterResource('static', '', output, null, {
        html: output ? output.outerHTML : input.outerHTML
      });
      return [pir];
    }
  }

  const logger = {
    debug: () => {},
    info: () => {},
    log: () => {},
    warn: (...args) => console.error(...args),
    error: (...args) => console.error(...args),
  }

  const storageHandler = new MemoryHandler(logger);
  const importer = new InternalImporter({
    storageHandler,
    skipDocxConversion: !toDocx,
    skipMDFileCreation: !toMd,
    logger,
    docxStylesXML
  });

  const pirs = await importer.import(url);

  const res = {
    html: pirs[0].extra.html
  }

  if (toMd) {
    const md = await storageHandler.get('/static.md');
    res.md = md;
  }
  if (toDocx) {
    const docx = await storageHandler.get('/static.docx');
    res.docx = docx
  }
  
  return res;
}

async function html2md(url, html, transformCfg) {
  return html2x(url, html, transformCfg, true, false);
}

async function html2docx(url, html, transformCfg) {
  return html2x(url, html, transformCfg, true, true);
}

export {
  Blocks,
  DOMUtils,
  html2md,
  html2docx,
};
