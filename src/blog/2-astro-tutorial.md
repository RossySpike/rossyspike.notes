---
title: "Siguiendo el tutorial de Astro"
pubDate: "2026-07-27"
description: "Descripcion de mi experiencia siguiendo el tutorial de astro"
author: "RossySpike"
category: "1-blog"
tags: ["programacion", "astro", "blog", "tutorial"]
---

Estas son las notas del tutorial de astro segun su [pagina web](https://docs.astro.build/es/tutorial/0-introduction/). Decidi hacerlo porque este 'blog' sera hecho en el mismo, pero primero:

## Que es Astro?

"Astro is the web framework for building content-driven websites like blogs, marketing, and e-commerce. Astro is best-known for pioneering a new frontend architecture to reduce JavaScript overhead and complexity compared to other frameworks. If you need a website that loads fast and has great SEO, then Astro is for you."

## Crear un proyecto en Astro

Astro utiliza `Node` (las versiones pares), para ver la version actual de node

```bash
node -v
```

Ahora, para crearlo, Astro ofrece la siguiente herramienta:

```bash
npm create astro@latest

```

salida:

```bash
honey  …/rossyspike.notes/es   astro-tutorial   10:40  npm create astro@latest
Need to install the following packages:
create-astro@5.2.2
Ok to proceed? (y) y
npm notice run npx
npm notice run 'create-astro'

 astro   Launch sequence initiated.

   dir   Where should we create your new project?
         ./programming

  tmpl   How would you like to start your new project?
         Use minimal (empty) template

  deps   Install dependencies?
         Yes

   git   Initialize a new git repository?
         No
      ◼  Sounds good! You can always run git init manually.

      ✔  Project initialized!
         ■ Template copied
         ■ Dependencies installed

  next   Liftoff confirmed. Explore your project!

         Enter your project directory using cd ./programming
         Run npm run dev to start the dev server. q + ENTER to stop.
         Add frameworks like react or tailwind using astro add.

         Stuck? Join us at https://astro.build/chat

╭─────╮  Houston:
│ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
╰─────╯
```

Como el output lo dice para ejecutar simplemente hay que escribir:

```bash
npm run dev
```

A partir de aca el tutorial de astro indica como conectarlo a netlify y github pages, no hare eso.

## Paginas en Astro

Los archivos `.astro` son los responsables de las paginas del sitio web.

1. Creare el archivo `src/pages/about.astro`
2. Copie y pegue el contenido de `index.asto` en el archivo nuevo
3. Ahora si visito `url/about` me encontrare con la nueva pagina

Ahora, para agregar links entre paginas astro usa los elementos estandar de `HTML` como el `<a>` (routes)

## Crear una publicacion

Para crear publicaciones o entradas en el blog se usan archivos `.md` (:DDDD)

1. Creare el directorio donde iran los posts `src/pages/posts/`
2. Dentro del mismo directorio cree el archivo `1-introduccion.md` y le agregue contenido
3. Igual que en el item anterior si visito una url, en este caso `url/posts/1-introduccion` puedo visualizar el contenido
   OJO: Astro ofrece metadata usando `frontmatter` para declarar informacion sobre la aplicacion

```yaml
---
title: "Mi primera publicación en el blog"
pubDate: 2022-07-01
description: "Este es la primera publicación de mi nuevo blog Astro."
author: "Alumno de Astro"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "El logotipo de Astro sobre un fondo oscuro con un brillo rosado."
tags: ["astro", "bloguear", "aprender en público"]
---
```

### Recursos importantes:

- https://www.markdownguide.org/cheat-sheet/
- [dev-tools](https://developer.mozilla.org/es/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools)
- https://assemble.io/docs/YAML-front-matter.html

## Contenido dinamico

Astro extiende los archivos html basicos, un ejemplo lo podemos ver cuando agregamos contenido dinamico

1. En el archivo `about.astro` agregare lo siguiente al inicio del archivo

```astro
---
const pageTitle = 'About';
---
```

2. Luego dentro de la etiqueta `<head>` agregare lo siguiente

```astro
<head>
...
<title>{pageTitle}</title>
</head>
```

Basicamente Astro permite declarar expresiones de JS

## Estilos

Para aplicar estilos se crea la etiqueta `<styles>` dentro de `<head>` y puedes aplicar estilos, a esto lo puedes combinar con lo antes mencionado. Para hacer referencia a variables dentro de la etiqueta de `<styles>` debes usar la directiva:

```astro
<styles define:vars={ {acaVanTusVariables} }>
...
<!-- Se acceden usando tag: var(tuVariable) -->
</styles>
```

### Hoja de estilo global

1. Crear archivo `global.css` en `src/styles/`
2. Declarar los estilos deseados
   Para usarlo dentro de una pagina se debe importar usando la _ruta relativa_

```astro
---
import '../styles/global.css'
---
```

### Recursos importantes:

- https://docs.astro.build/es/reference/astro-syntax/#diferencias-entre-astro-y-jsx
- https://docs.astro.build/es/guides/styling/#estilando-en-astro
- https://docs.astro.build/es/guides/styling/#variables-de-css

## Componentes

Los componentes son piezas de codigo que pueden ser reutilizadas, en este caso, hare un componente de una barra de navegacion

1. Crear archivo `src/components/navigation.astro`
2. Escribir el contenido del archivo:

```astro
---
---
<a href="/">Inicio</a>
<a href="/about/">Sobre mi</a>
<a href="/blog/">Blog</a>

```

3. Para utilizarlo, simplemente se importa en el archivo `.astro` a usar, por ejemplo en el `index.astro`

```astro
---
import Navigation from '../components/navigation.astro'
const pageTitle = 'Notes'
---
<html lang="en">
...
	<body>
    <h1>{pageTitle}</h1>
    <Navigation />
	</body>
</html>
```

**NOTA:** Los componentes deben estar escrito en _PascalCase_ para que el parser de `Astro` pueda distingirlo de las etiquetas estandar `HTML`
Agregare el componentes a las demas paginas ^v^

Siguiendo con el tutorial de la pagina, voy a hacer un **footer** con lo aprendido.

Queda de la siguiente manera `/components/footer.astro`

```astro
---
const platform = 'github';
const userName = 'rossyspike';
---
<footer>
  <p>Mis cagadas de codigo: <a href={`https://www.${platform}.com/${userName}`}>{platform}</a></p>
</footer>

```

#### Props

Como se puede tener multiples redes sociales, vamos a crear un componente reutilizable para que sea mas facil agregar redes sociales, para esto usaremos una propiedad de `Astro` y estos son los `props`.

1. Crear el archivo `/components/social.astro`
2. Escribir lo siguiente:

```astro
---
const { platform, username } = Astro.props;
---
<a href={`https://www.${platform}.com/${username}`}>{platform}</a>
```

3. Para usarlo, primero se importa y se colocan los `props` (propiedades) como atributos de la etiqueta `HTML`, quedando:

```astro
---
import Social from './social.astro'
---
<footer>
  <p>Mis cagadas de codigo: <Social platform='github' userName='rossyspike'/></p>
</footer>
```

Lo siguiente seria hacer un componente `header` que importe el componente de `navigation`, para esto hare el mismo proceso de antes asi que no lo detallare

```astro
---
import Navigation from './navigation.astro'
---
<header>
  <nav>
    <Navigation/>
  </nav>
</header>
```

## Scripts

Siguiendo el tutorial de `Astro` nos mandaron a escribir css para la pagina, sin embargo, quieren que agreguemos un buton para abrir y cerrar enlaces en pantallas de dispositivos moviles, para esto se necesita **interactividad** por lo que escribiremos nuestra primera etiqueta `script`

1. Crear componente `menu`

```astro
---
---
<button aria-expanded="false" aria-controls="main-menu" class="menu">
  Menu
</button>
```

2. Agregarlo en el componente `Header` justo antes de `Navigation`
3. Agregar etiqueta `script` en `index`:

```astro
...
  <Footer />
  <script>
    const menu = document.querySelector('.menu');

    menu?.addEventListener('click', () => {
      const isExpanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', `${!isExpanded}`);
    });
  </script>
</body>
```

4. Sin embargo, tambien se puede importar como un archivo `js` independiente, de la siguiente forma:
5. 1. Crear archivo `src/scripts/menu.js`
6. 2. copiar el codigo
7. 3. Importarlo

```astro
...
	<body>
    <h1>{pageTitle}</h1>
    <Header />
    <Footer/>
    <script>
      import "../scripts/menu.js";
    </script>
	</body>
</html>

```

`Astro` ejecuta `js` al momento de compilar cuando lo utilizamos en el frontmatter, y lo envia cuando se escribe con una etiquta

## Plantillas

1. Crear archivo `src/layout/base_layout.astro`. NOTA: con `base-layout` el lsp me daba error no se por que.
2. Copiar contenido de `index.astro` al nuevo archivo
3. Incluir `base_layout.astro` en `index.astro`

```astro
---
import BaseLayout from '../layouts/base_layout.astro';
const pageTitle = "Notes";
---
<BaseLayout>
<h2>Subtitulo</h2>
</BaseLayout>
// No deberia haber cambios aca
```

4. Agregar la etiqueta `<slot/>` en `base_layout`. Esa etiqueta indica le india a `Astro` que ahi va a poner lo que escribas dentro de la etiqueta del componente/layout
5. Agregaremos el titulo de la pagina como un prop, dentro de `base_layout.astro`

```
---
...
const {pageTitle} = Astro.props
---
```

6. Pasarle `pageTitle` a la etiqueta `BaseLayout` en `index.astro`
7. Refactorizare las demas paginas para que usen el `base-layout`
   NOTA:
   Conservando los estilos de tu página About

Usar `<BaseLayout>` para renderizar tu página about.astro significa que perderás la etiqueta `<style>` agregada en el `<head>` de esta página. Para seguir aplicando estilos únicamente a nivel de página usando los estilos con alcance de Astro, mueve la etiqueta `<style>` al cuerpo del componente de la página. Esto te permitirá estilizar elementos creados en este componente de página (por ejemplo, tu lista de habilidades).

Dado que tu `<h1>` ahora es creado por el componente plantilla, puedes agregar el atributo is:global a tu etiqueta de estilo para que afecte a todos los elementos de esta página, incluidos los creados por otros componentes: `<style is:global define:vars={{ skillColor, fontWeight, textCase }}>`

### Plantillas en entradas de blog

Al agregar la propiedad `layout` en el `frontmatter` de un archivo `.md`

1. Crear el archivo `src/layouts/markdown_post_layout.astro`
2. Escribir:

```astro
---
const { frontmatter } = Astro.props;
---
<meta charset="utf-8" />
<h1>{frontmatter.title}</h1>
<p>Escrito por {frontmatter.author}</p>
<slot />
```

3. En el archivo `src/pages/posts/1-introduccion.md` agregar:

```astro
---
layout: ../../layouts/markdown_post_layout.astro
---
```

#### Anidar plantillas

1. Importar `base_layout` en `markdown_post_layout`.

```astro
---
import BaseLayout from "./base_layout.astro";
const { frontmatter } = Astro.props;
---
<BaseLayout pageTitle={frontmatter.title}>
<p>Escrito por {frontmatter.author} | {frontmatter.pubDate.toString().slice(0,10)}</p>
<slot />
</BaseLayout>
```

## Mostrar dinamicamente lista de entradas

1. en `blog.astro` escribir:

```astro
---
...
const allPosts = Object.values(import.meta.glob('./posts/*.md', { eager: true }));
---
...
<ul>

{allPosts.map((post:any)=><li><a href={post.url}>{post.frontmatter.title}</a></li>)}
</ul>
...
```

`import.meta.glob()` devuelve un array de objetos, su primer argumento es de done los sacara y el segundo argumento le dice que los cargue al principio
Sin embargo, como desafio, voy a crear un componente para reemplazar la etiqueta `<li>`

## Enrutamiento dinamico de paginas

Puedes crear conjuntos completos de páginas de forma dinámica utilizando archivos `Astro` que exporten una función `getStaticPaths()`.

1. Crear `src/pages/tags/[tag].astro`
2. Escribir:

```astro
---
import BaseLayout from '../../layouts/base_layout.astro';

export async function getStaticPaths() {
  return [
    { params: { tag: "astro" } },
    { params: { tag: "blog" } },
    { params: { tag: "programacion" } },
  ];
}

const { tag } = Astro.params;
---
<BaseLayout pageTitle={tag}>
  <p>Entradas etiquetadas con {tag}</p>
</BaseLayout>
```

`getStaticPaths` devuelve un array de rutas de paginas, todas las paginas en esas rutas usaran la misma plantilla definida en el fichero
Sin embargo para poder navegar se necesitan agregar las entradas del blog, para esto se necesita agregar lo siguiente:
`src/pages/tags/[tag].astro`

```astro
---
import BaseLayout from '../../layouts/base_layout.astro';
import BlogPost from '../../components/blogpost.astro';

export async function getStaticPaths() {
  const allPosts = Object.values(import.meta.glob('../posts/*.md',{eager:true}));
  return [
    { params: { tag: "astro" }       , props: {posts: allPosts}},
    { params: { tag: "blog" }        , props: {posts: allPosts}},
    { params: { tag: "programacion" }, props: {posts: allPosts}},
  ];
}

const { tag } = Astro.params;
const {posts} = Astro.props;
const filteredPosts = posts.filter((post: any) => post.frontmatter.tags?.includes(tag));
---
<BaseLayout pageTitle={tag}>
  <p>Entradas etiquetadas con {tag}</p>
  <ul>
    {filteredPosts.map((post:any)=><BlogPost url={post.url} title={post.frontmatter.title} />)}
  </ul>
</BaseLayout>
```

NOTA:
Si necesitas información para construir las rutas de la página, escríbela dentro de getStaticPaths().
Para recibir información en la plantilla HTML de una ruta de página, escríbela fuera de getStaticPaths().

Ahora, hay un problema con el codigo anterior, cada vez que querramos agregar una etiqueta debemos declararla en el arreglo, lo que vamos a cambiar ahora es que se obtengan las etiquetas directamente de cada archivo/post.

```astro
---
import BaseLayout from '../../layouts/base_layout.astro';
import BlogPost from '../../components/blogpost.astro';

export async function getStaticPaths() {
  const allPosts = Object.values(import.meta.glob('../posts/*.md',{eager:true}));
  const uniqueTags = [...new Set(allPosts.map((post:any) => post.frontmatter.tags).flat())];
  return uniqueTags.map((tag) => {

    const filteredPosts = allPosts.filter((post: any) => post.frontmatter.tags.includes(tag));
    return {
      params: {tag},
      props: {posts: filteredPosts},
      };
  });
}

const { tag } = Astro.params;
const {posts} = Astro.props;
---
<BaseLayout pageTitle={tag}>
  <p>Entradas etiquetadas con {tag}</p>
  <ul>
    {posts.map((post:any)=><BlogPost url={post.url} title={post.frontmatter.title} />)}
  </ul>
</BaseLayout>
```

## Pagina indice de etiquetas

La idea es sencilla, simplemente es agregar una pagina que muestre los tags disponibles al visitar `url/tags/`

1. Crear `src/pages/tags/index.astro`
2. Una vez creada la pagina debemos agregar las etiquetas de forma dinamica
3. Reutilizando el codigo de `src/pages/tags/[tag].astro` agregar dinamicamente las etiquetas, quedando:

```astro
---
import BaseLayout from '../../layouts/base_layout.astro'
const pageTitle = 'Tags'
const allPosts = Object.values(import.meta.glob('../posts/*.md',{eager:true}));
const uniqueTags = [...new Set(allPosts.map((post:any) => post.frontmatter.tags).flat())];
---
<BaseLayout pageTitle={pageTitle}>
  <div class="tags">
    {uniqueTags.map((tag:any)=> <p class='tag'> <a href={`/tags/${tag}`}>{tag}</a></p>)}
  </div>

</BaseLayout>
<style>
  a {
    color: #00539F;
    margin: 0.25em;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
  }

  .tag {
    margin: 0.25em;
    border: dotted 1px #a1a1a1;
    border-radius: .5em;
    padding: .5em 1em;
    font-size: 1.15em;
    background-color: #F8FCFD;
  }
</style>
```

4. Agregarlo en el componente `navigation.astro`

```astro
---
---

<div id='main-menu' class='nav-links'>
  <a href="/">Inicio</a>
  <a href="/about/">Sobre mi</a>
  <a href="/blog/">Blog</a>
  <a href="/tags/">Tags</a>
</div>
```

5. Y como reto lo agregare en `markdown_post_layout.astro` para que las tags sean enlaces

```astro
---
import BaseLayout from './base_layout.astro';
const { frontmatter } = Astro.props;
---
<BaseLayout pageTitle={frontmatter.title}>
<p>Escrito por {frontmatter.author} | {frontmatter.pubDate.toString().slice(0,10)}</p>
<div class='tags'>
  {frontmatter.tags.map((tag:string)=><p class='tag'><a href=`/tags/${tag}` >{tag}</a></p>)}
<style>
  a {
    color: #00539F;
    margin: 0.25em;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
  }

  .tag {
    margin: 0.25em;
    border: dotted 1px #a1a1a1;
    border-radius: .5em;
    padding: .5em 1em;
    font-size: 1.15em;
    background-color: #F8FCFD;
  }
</style>
</div>
<slot />
</BaseLayout>
```

6. Refactorizar

## Coleccion de contenido

Son la mejor forma de manejar contenido estructurado ya que en `Astro` permiten usar APIs mas poderosas y de mejor rendimiento, consisten en un conjunto de elementos relacionados con estructura identica. Pueden ser almacenados en forma local o remota (el primero como un json con descripciones de productos, archivos markdown individuales; y el ultimo obtenido a traves de bases de datos, CMS o APIs). Cada elemento de una `coleccion` se denomina `entrada` (una `coleccion` esta definida por su ubicacion y la forma de sus `entradas`).

Todos los tipos de `colecciones` tienen:

- loader: para obtener el contenido y la metadata
- schema: una coleccion opcional que define la forma de cada `entrada`

### Tipos

#### Colecciones en tiempo de compilacion (Build-time content collection)

#### Colecciones en tiempo de ejecucion (Runtime content collection)

### Implementacion de coleccion en tiempo de compilacion

Astro usa la biblioteca `Zod` para trabajar con estas colecciones (define estructura).

Para implementarlo en este proyecto:

1. Crear directorio `src/blog/`.
2. Mover las publicaciones a la carpeta recien creada.
3. Crear archivo `src/content.config.ts` para declarar el esquema del nuevo `postCollection`

```ts
// Importa el cargador glob
import { glob } from "astro/loaders";
// Importa utilidades de `astro:content` y `astro/zod`
import { defineCollection } from "astro:content";
// Importa Zod
import { z } from "astro/zod";
// Define un `loader` y un `schema` para cada colección
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
  }),
});
// Exporta un solo objeto `collections` para registrar tus colecciones
export const collections = { blog };
```

4. Crear `src/pages/posts/[...slug].astro` para poder generar cada pagina de blog individual porque los archivos `Markdown` y `MDX` dejan de convertirse en paginas (usando el enrutamiento basado en archivos de `Astro`) al ser usadas en colecciones `colecciones`. Con el siguiente codigo:

```astro
---
import { getCollection, render } from 'astro:content';
// importar nuestro layout de post
import MarkdownPostLayout from '../../layouts/markdown_post_layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id }, props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<!-- renderizar el contenido -->
<MarkdownPostLayout frontmatter={post.data}>
  <Content />
</MarkdownPostLayout>
```

5. Eliminar el atributo `layout` de cada post
6. Reemplazar `import.meta.glob()` con `getCollection()`
   - `/src/pages/blog.astro`
   - `/src/pages/tags/[tag].astro`
   - `/src/pages/tags/index.astro`
     Ej:

```astro
---
import BaseLayout from '../../layouts/base_layout.astro'
import {getCollection} from 'astro:content';
const pageTitle = 'Tags'
const allPosts = await getCollection('blog');
const uniqueTags = [...new Set(allPosts.map((post:any) => post.data.tags).flat())];
---
<BaseLayout pageTitle={pageTitle}>
  <div class="tags">
    {uniqueTags.map((tag:any)=> <p class='tag'> <a href={`/tags/${tag}`}>{tag}</a></p>)}
  </div>

</BaseLayout>
<style>
  a {
    color: #00539F;
    margin: 0.25em;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
  }

  .tag {
    margin: 0.25em;
    border: dotted 1px #a1a1a1;
    border-radius: .5em;
    padding: .5em 1em;
    font-size: 1.15em;
    background-color: #F8FCFD;
  }
</style>
```

! Notese: la funcion `getCollection` devuelve una promesa por lo que al accederlo se debe esperar a que se resuelva la misma, por ultimo, el tipo que retorna es un [`CollectionEntry[]`](https://docs.astro.build/en/reference/modules/astro-content/#collectionentry), y para acceder a los datos del `frontmatter` se debe acceder al atributo `data` de un miembro del arreglo de dicho tipo.

## Tarea

- Visitar los links.
- Invesigar `diseño mobile first`
- https://docs.astro.build/en/guides/deploy/github/
- Generador de markdown con el frontmatter que necesito
- Directivas de cliente (ASTRO): https://docs.astro.build/es/reference/directives-reference/#directivas-del-cliente
- Islas
- "Hidratado"
  Vuelve a visitar tu página y compara los dos componentes. El segundo botón funciona porque la directiva client:load le dice a Astro que envíe y vuelva a ejecutar tu JavaScript en el cliente cuando la página cargue, haciendo que el componente sea interactivo. Esto se llama un componente hidratado.

Una vez que la diferencia esté clara, elimina el componente Greeting sin hidratar
