import {
  PageImporter,
  PageImporterResource,
  DOMUtils,
  Blocks,
  MemoryHandler,
} from '@adobe/helix-importer';


class WebImporter {
  static async transform(html, transformFct) {
    class InternalImporter extends PageImporter {
      async fetch() {
        return new Response(html);
      }

      async process(document) {
        const out = document;//transformFct(document);
        const pir = new PageImporterResource('static', '/', out, null, {});
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

    const results = await importer.import('');
    console.log(results);
    return await storageHandler.get('//static.md');
  }
}

export {
  Blocks,
  DOMUtils,
  WebImporter
};
