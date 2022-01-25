import {
  PageImporter,
  PageImporterResource,
  DOMUtils,
  Blocks,
} from '@adobe/helix-importer';


class WebImporter {
  static async transform(html, transformFct) {
    class InternalImporter extends PageImporter {
      async fetch() {
        return html;
      }

      async process(document) {
        const out = transformFct(document);
        const pir = new PageImporterResource('static', '/', out, null, {});
        return [pir];
      }
    }
    
    const importer = new InternalImporter({
      storageHandler: new MemoryHandler(console),
      skipDocxConversion: true,
      // skipMDFileCreation: true,
      logger: console,
    });

    const results = await importer.import('');
    console.log(results);
    return await storageHandler.get('/static.md');
  }
}

export {
  Blocks,
  DOMUtils,
  WebImporter
};
