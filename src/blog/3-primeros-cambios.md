---
title: "Primeros cambios del blog"
pubDate: "2026-07-28"
description: "Ya que termine el tutorial, es hora de personalizarlo."
author: "RossySpike"
category: "1-blog"
tags: ["programacion", "astro", "blog"]
---

Esta entrada de blog es la primera luego de haber puesto el blog en github y en produccion (bueno en netlify XD). En fin, como lo dice el titulo, para los primeros cambios del blog, me centre en 2 aspectos:

## 1. Estructura del blog

Con esto me refiero al cuerpo del blog, donde debe ir cada cosa y que informacion debo mostrar, por ejemplo, (al menos al momento de escribir esto) el header que ves al tope y la barra lateral que funciona como indice de contenido del blog, separado por `categoria` de blog. Me inspire bastante en paginas de documentacion como la de [Astro](https://docs.astro.build/en/getting-started/) y [C3](https://c3-lang.org/language-overview/examples/) (De este ultimo quiero escribir **MUCHO**). Como estamos hablando de estructura, la forma mas facil de mostrarla es con el `html`, para darle la estructura en todas las paginas del `blog` edite el layout `base_layout.astro`

```astro
...
	<body>
    <header>
      <Header id='header' />
    </header>
    <div id='container'>
      <aside>
        <p>indice</p>
        <ContentList />
      </aside>
      <main>
        <h1>{pageTitle}</h1>
        <slot/>
        <Footer/>
      </main>
    </div>
...
```

### Explicacion:

#### Barra Superior

El componente que se encarga de esta barra esta encerrado en la etiqueta `<header>` y es la etiqueta `<Header>`, realmente no hice muchos cambios, mas que todo solo agregue la etiqueta `<img/>`

En `src/components/header.astro`:

```astro
<header>
  <img src='https://avatars.githubusercontent.com/u/149632249?v=4'/>
  <nav>
    <Navigation/>
    <Menu/>
  </nav>
</header>
```

#### Barra lateral

Aca las cosas se ponen mas _entretenidas_ porque tuve que meter codigo. La idea es sencilla, una lista que muestra las `categorias` o `temas principales` y por cada una de estas que muestre la lista de `entradas` o `publicacions`, en el `html` esta lista se encuentra en la etiqueta `<aside>` y es el componente `<ContentList>`
En `src/components/content_list.astro`:

```astro
---
import { getCollection } from "astro:content";
import type { CollectionEntry } from 'astro:content';
import BlogPost from './blogpost.astro'
const posts =  await getCollection('blog');
const contents = new Map();
( posts.sort((postA:CollectionEntry<'blog'>, postB:CollectionEntry<'blog'>) => parseInt( postA.data.category.split('-')[0] ) - parseInt(postB.data.category.split('-')[0])) ).forEach((post:CollectionEntry<'blog'>)=>{
const category = post.data.category.split('-')[1];
if (!contents.has(category)){
contents.set(category, [])
}
contents.get(category).push(post);
})
---
<div>
  <ul id='category-list'>
    {[... contents].map(([ category, post ])=>(

    <li>
      <span>{ category } </span>
      <ul id='post-list'>
        {post.sort((postA:CollectionEntry<'blog'>, postB:CollectionEntry<'blog'>) => parseInt( postA.id.split('-')[0] ) - parseInt(postB.id.split('-')[0])).map((p:CollectionEntry<'blog'>)=> <BlogPost url=`/posts/${p.id}` title={p.data.title}/> )}
      </ul>
    </li>
    )
    )}
  </ul>
</div>
```

Quiza no creas que se parece a lo que hemos hecho antes pero no temas, te daras cuenta que si, pero vamos por partes:

1. Tuve que modificar un poco la definicion del a coleccion para agregar la categoria dentro del `frontmatter`.

   1. El atributo de `category` o **categoria** lo estableci con el formato de `numero-nombre`.

   ```ts
   export const blogSchema = z.object({
     // ...
     category: z.string().regex(/^\d+-[a-z0-9-]+$/, "Invalid category format"),
     // ... NOTA: hice varios cambios aca, en el siguiente blog hablare de esto
   });
   ```

   2. El nombre del archivo tiene el **mismo** formato que el item anterior.

2. Sabiendo esto, la variable `contents` va a guardar una **clave** (key) que tendra el valor del nombre de la `categoria` y guarda un arreglo que contiene todos sus posts asociados.

```ts
const contents = new Map();
posts
  .sort(
    (postA: CollectionEntry<"blog">, postB: CollectionEntry<"blog">) =>
      parseInt(postA.data.category.split("-")[0]) -
      parseInt(postB.data.category.split("-")[0]),
  ) // 1. Ordeno los blogs por su numero de categoria
  .forEach((post: CollectionEntry<"blog">) => {
    // 2. Iterar por cada blog
    const category = post.data.category.split("-")[1];
    if (!contents.has(category)) {
      contents.set(category, []);
    }
    contents.get(category).push(post);
    // 3. Guardar la categoria y agregarle sus respectivos blogs en la variable `contents`
  });
```

3. En el `template` simplemente se generan las listas

```astro
  <ul id='category-list'>
    {[... contents].map(([ category, post ])=>( // 1. Hack de typescript para iterar sobre los elementos de un `Map`

    <li>
      <span>{ category } </span> // 2. Escribir la categoria como entrada en la lista padre
      <ul id='post-list'>
        {post.sort((postA:CollectionEntry<'blog'>, postB:CollectionEntry<'blog'>) => parseInt( postA.id.split('-')[0] ) - parseInt(postB.id.split('-')[0])) // 3. Ordenar los posts (recuerda que el `id` es el nombre de archivo y este mismo tiene el formato de `category`)
  .map((p:CollectionEntry<'blog'>)=> <BlogPost url=`/posts/${p.id}` title={p.data.title}/> ) // 4. Agregar el post
  }
      </ul>
    </li>
    )
    )}
  </ul>
```

## 2. Estilo del blog

Esta es la parte mas dificil para mi jajaja, realmente no soy muy creativo creando diseños, asi que tome lo que me gustaba de mis referencias y las trate de implementar, para esto me apoye de 2 `frameworks` de `css`.

- [Sakura.css](https://oxal.org/projects/sakura/) (especificamente [el modo oscuro](https://oxal.org/projects/sakura/#dark-mode)) para el estilo general del sitio
- [Typhography.css](https://github.com/MunifTanjim/typography.css.git)

Para pantallas pequeñas tengo pensado que en el header (la barra superior) este un boton que despliegue los botones de **navegacion rapida** (`about`, `tags`, ...) y el **indice de contenido**, para pantallas grandes me parece bien como es ahora.
