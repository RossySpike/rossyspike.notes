import { z } from "astro/zod";
import { appendFileSync } from "node:fs"; // Import nativo ESM que Node entiende sin require
import { blogSchema } from '../../src/schemas/blog.ts'
declare function require(name: string): {
  appendFileSync: (file: string, data: string | Uint8Array, options?: string | { encoding?: string | null; mode?: number | string; flag?: string }) => void;
};


type CollectionData = {
  shape: z.ZodObject<any>;
  fileData: {
    path: string;
    format: RegExp;
  };
};
const supportedCollections = new Map<string, CollectionData>([
  ['blog', { shape: (blogSchema as z.ZodObject<any>).shape, fileData: { format: /^\d+-[a-z0-9-]+$/, path: './src/blog/' } }]
]);

try {
  if (process.argv.length < 3)
    throw new Error('Not enough args')

  const args = process.argv.slice(2);

  const selectedCollection = supportedCollections.get(args[0]);
  if (!selectedCollection)
    throw new Error('Selected collection not found');

  const zodObj = z.object(selectedCollection.shape);

  const rawData: Record<string, string> = {};
  let fileName = '';
  (args.slice(1)).forEach((taggedValue: string) => {
    const data = taggedValue.split('=');
    if (data.length != 2)
      throw new Error(`${taggedValue}\n^ is an invalid input`);
    const [key, value] = data;
    if (key === 'fileName') {
      if (!selectedCollection.fileData.format.test(value))
        throw new Error(`${taggedValue}, doesnt match ${selectedCollection.fileData.format}`);
      fileName = value;
    }
    else
      rawData[key] = value;
  });
  if (!fileName)
    throw new Error(`"fileName" not found`)
  const result = zodObj.parse(rawData);


  const filePath = `${selectedCollection.fileData.path}${fileName}.md`;
  appendFileSync(filePath, '---\n');

  for (const [key, value] of Object.entries(result)) {
    let formattedValue: string;
    if (value instanceof Date) {
      formattedValue = value.toISOString().split('T')[0];
    } else if (Array.isArray(value)) {
      formattedValue = JSON.stringify(value);
    }
    else {
      formattedValue = `"${value}"`
    }
    appendFileSync(filePath, `${key}: ${formattedValue}\n`);

  }
  appendFileSync(filePath, '---\n');
  console.log(`file succesfully written to: ${filePath}`)

} catch (e) {
  console.log(`${e}`);
  console.log('USAGE:\narg1 needs to be the name of the collection.\nThe rest of the arguments should be named (i.e `title="my value"`)')
}
