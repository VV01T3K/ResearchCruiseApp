import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const endpointsDir = fileURLToPath(new URL('../src/api/orval/endpoints/', import.meta.url));
const httpMethodName =
  /^(get(?!Get|Post|Put|Patch|Delete|Head)[A-Z]|post[A-Z]|put[A-Z]|patch[A-Z]|delete[A-Z]|head[A-Z])/;
const operationResultTypeName = /(?:Mutation|SuspenseQuery)(?:Result|Body|Error)$/;

function shouldHideExport(name) {
  return name.endsWith('Url') || name.endsWith('MutationOptions') || httpMethodName.test(name);
}

async function getGeneratedEndpointFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        return getGeneratedEndpointFiles(path);
      }

      return entry.isFile() && entry.name.endsWith('.gen.ts') ? [path] : [];
    })
  );

  return files.flat();
}

const files = await getGeneratedEndpointFiles(endpointsDir);
let changedExports = 0;
let removedTypes = 0;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const withoutOperationTypes = source.replace(/^export type ([A-Za-z0-9_]+)\s*=\s*[\s\S]*?;\n?/gm, (match, name) => {
    if (!operationResultTypeName.test(name)) {
      return match;
    }

    removedTypes += 1;
    return '';
  });
  const transformed = withoutOperationTypes
    .replace(/^export const ([A-Za-z0-9_]+)/gm, (match, name) => {
      if (!shouldHideExport(name)) {
        return match;
      }

      changedExports += 1;
      return `const ${name}`;
    })
    .replace(/\n{3,}/g, '\n\n');

  if (transformed !== source) {
    await writeFile(file, transformed);
  }
}

console.log(`hid ${changedExports} generated helper exports and removed ${removedTypes} type aliases`);
