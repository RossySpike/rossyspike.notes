---
title: "Generador de Frontmatter"
pubDate: "2026-07-28"
description: "Explicando el porque y uso de esta herramienta"
author: "RossySpike"
category: "1-blog"
tags: ["programacion", "herramientas", "typescript", "blog"]
---

En la raiz del proyecto hay una carpeta ( `tools` ) donde hay **herramientas** utiles para el blog; esta entrada del blog va dedicada a la herramienta: `post_metadata_generator`

## Por que

Esta herramienta es un script escrito en `typescript` que nace de querer estandarizar la creacion del `frontmatter` de forma extendible, con el fin de reducir el inevitable error humano.

## Uso

Desde la raiz del proyecto, ejecutar:

```bash
npx tsx tools/post_metadata_generator/main.ts nombre-coleccion fileName="nombre de archivo" schema-properties
```

| Argumento             | Explicacion                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| **nombre-coleccion**  | Nombre exacto del `Schema` (los que se declaran con la libreria `Zod`). **DEBE** ser el primer argumento. |
| **fileName**          | Nombre del archivo a generar.                                                                             |
| **schema-properties** | Las propiedades del esquema elegido, deben ser declaradas con el formato `propiedad=valor`                |

### Como funciona

Para explicar el funcionamiento usare como ejemplo el comando para crear este archivo:

```console
user@pc: ~$ npx tsx tools/post_metadata_generator/main.ts blog fileName=4-generador-frontmatter title="Generador de Frontmatter"  description="Explicando el porque y para que de esta herramienta" category="1-blog" tags="['programacion','herramientas','typescript','blog']"

npm notice run programming@0.0.1 npx
npm notice run 'tsx' tools/post_metadata_generator/main.ts blog fileName=4-generador-frontmatter title=Generador de Frontmatter description=Explicando el porque y para que de esta herramienta category=1-blog tags=['programacion','herramientas','typescript','blog']
file succesfully written to: ./src/blog/4-generador-frontmatter.md
```

Vamos por partes:

1. Si te fijas estoy parado en la raiz del proyecto, (si no sabes por que digo esto fijate en la ruta de script a ejecutar por npx) y no es un error, esto es porque deje una ruta relativa declarada en:

```ts
const supportedCollections = new Map<string, CollectionData>([
  [
    "blog",
    {
      shape: (blogSchema as z.ZodObject<any>).shape,
      fileData: { format: /^\d+-[a-z0-9-]+$/, path: "./src/blog/" },
    },
  ],
]);
```

2. Una vez que se ejecuta el script hace 2 **preguntas**, si cualquiera es falsa, termina el programa
   1. Me llego el argumento de `schema` ?
   2. Existe dicho `schema` ?
3. Guarda los valores de los argumentos

4. Si no encuentra el nombre de archivo falla y termina el programa

5. Con los argumentos intenta crear con `Zod` el `schema` y si esta creacion tira error el programa falla y termina

6. Por ultimo genera el archivo en su ubicacion declarada y escibe el frontmatter

### Extender

La forma en que se extiende la herramienta es importando un `schema` y agregarlo en `supportedCollections`. Ej:

```ts
import { blogSchema } from "../../src/schemas/blog.ts"; // Schema a agregar

type CollectionData = {
  shape: z.ZodObject<any>; // Aqui se guarda el schema
  fileData: {
    path: string; // Directorio de destino
    format: RegExp; // Formato de nombre del archivo
  };
};
const supportedCollections = new Map<string, CollectionData>([
  [
    "blog", // Identificador del schema, si el usuario quiere crear una entrada de esta coleccion debe escribir esto
    {
      shape: (blogSchema as z.ZodObject<any>).shape,
      fileData: { format: /^\d+-[a-z0-9-]+$/, path: "./src/blog/" },
    },
  ],
]);
```

## Posibles mejoras

| Propuesta                                      | Por que                                                                          | Estado |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| Mejorar output                                 | Para que sea mas claro de usar y si ocurre un error raro se pueda entender mejor | 🤔     |
| Agregar `-h`                                   | Mostrar uso de la herramienta                                                    | 🤔     |
| Mostrar `schemas` disponibles y su informacion | Para poder ver que informacion necesita cada `schema`                            | 🤔     |
