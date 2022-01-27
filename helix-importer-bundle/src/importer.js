import {
  PageImporter,
  PageImporterResource,
  DOMUtils,
  Blocks,
  MemoryHandler,
} from '@adobe/helix-importer';


async function html2md(url, html, transformFct) {
  class InternalImporter extends PageImporter {
  async fetch() {
    return new Response(html);
  }

  async process(input) {
    const output = transformFct(input);
    const pir = new PageImporterResource('static', '', output || input, null, {
      html: output ? output.outerHTML : input.outerHTML
    });
    return [pir];
  }
  }

  const storageHandler = new MemoryHandler(console);
  const importer = new InternalImporter({
    storageHandler,
    skipDocxConversion: true,
    // skipMDFileCreation: true,
    logger: console,
  });

  const pirs = await importer.import(url);

  const md = await storageHandler.get('/static.md');
  return {
    md,
    html: pirs[0].extra.html
  }
}

export {
  Blocks,
  DOMUtils,
  html2md,
};
