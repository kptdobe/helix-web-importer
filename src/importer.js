/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import path from 'path';
import {
  PageImporter,
  PageImporterResource,
  DOMUtils,
  Blocks,
  MemoryHandler,
} from '@adobe/helix-importer';

import docxStylesXML from '../resources/styles.xml';

async function html2x(url, html, transformCfg, toMd, toDocx) {
  let name = 'static';
  let dirname = ''

  class InternalImporter extends PageImporter {
    async fetch() {
      return new Response(html);
    }

    async process(document) {
      // remove the helix-importer from the provided DOM
      document.querySelector('helix-importer').remove();

      let output = document.body;
      if (transformCfg && transformCfg.transformDOM) {
        output = transformCfg.transformDOM(document);
      }
      output = output || document.body;

      if (transformCfg && transformCfg.generateDocumentPath) {
        const p = transformCfg.generateDocumentPath(url, document);
        if (p) {
          name = path.basename(p);
          dirname = path.dirname(p);
        }
      }

      const pir = new PageImporterResource(name, dirname, output, null, {
        html: output.outerHTML
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
    html: pirs[0].extra.html,
  }

  if (name !== 'static') {
    res.name = name;
    res.dirname = dirname;
    res.path = `${dirname}/${name}`;
  } else {
    res.path = `/${name}`
  }

  if (toMd) {
    const md = await storageHandler.get(pirs[0].md);
    res.md = md;
  }
  if (toDocx) {
    const docx = await storageHandler.get(pirs[0].docx);
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
