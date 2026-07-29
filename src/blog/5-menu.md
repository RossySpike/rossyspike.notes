---
title: "Menu"
pubDate: "2026-07-29"
description: "Creando un menu para la interfaz en movil"
author: "RossySpike"
category: "1-blog"
tags: ["blog", "programacion", "astro"]
---

Siguiendo [el tutorial de astro](/posts/2-astro-tutorial) creamos un **boton** de menu, en este post lo vamos a adaptar al blog.

## Objetivo

Quiero que el boton aparezca cuando la pantalla es lo suficientemente pequeña para renderizar el indice y/o el texto de la barra superior

## Implementacion

1. Agregue al proyecto el paquete `astro-icon`, que ofrece una gran lista de iconos `svg` y los agrega directamente en el proceso de **build** lo que evita hacer **requests** extras.

```console
user@pc: ~$ npx astro add astro-icon
```

2. Ahora toca elegir un icono, en mi caso me decante por [este](https://icon-sets.iconify.design/mdi-light/menu/). Se instala de la siguiente forma:

```console
user@pc: ~$ npm install -D @iconify-json/mdi-light
```

3. Agregar el icono al **menu**.

```astro
// `src/components/menu.astro`
---
import { Icon } from 'astro-icon/components'
---
<button aria-expanded="false" aria-controls="main-menu" class="menu">
  <Icon name="mdi-light:menu" />
</button>
```

4.  En este punto voy a tocar todo lo referente al estilo del boton.

    1. Quiero que se vea en el momento que el `indice` se deje de ver aparezca el `menu` tambien, esto lo consegui con:

    ```css
    //styles/global.css
    @media (width < 50rem) {
      .menu {
        display: inline-block;
      }
    }
    ```

    2. Estilo del boton como tal:

    ```css
    // styles/global.css
    .menu {
      display:none; // esto oculta el boton
      background: none;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      font-weight: bold;
      padding: 5px 10px;
      &:hover {
        background: none;
        color: #fff;
      }
    }
    ```

    3. Hay un error y es que cuando se activa el boton los links se ven uno encima del otro en lugar de en una sola linea, ademas que quiero que desaparezcan cuando la pantalla es pequeña, para esto tuve que escribir lo siguiente

    ```css
    // styles/global.css
    .nav-links {
      width: 100%;
      display: none; // desactivado por defecto
      line-height:0;
      margin: 0;
      justify-content: space-evenly;
      gap: 0.4em;
    }
    @media screen and (min-width: 636px) {
      .nav-links {
        display: flex; // permitir que se vea la navegacion cuando la pantalla es grande
        line-height:1.618;
      }
    }
    ```

    ```astro
    // src/components/header.astro
    ---
    import Navigation from './navigation.astro'
    import Menu from './menu.astro'
    ---
    <header>
      <div>
        <img src='https://avatars.githubusercontent.com/u/149632249?v=4'/>
        <nav>
          <Navigation/>
        </nav>
      </div>
      <Menu/>
    </header>
    <style>
      header {
        display: flex;
        padding:5px;
        justify-content: space-between;
      }
      img {
        max-height: 100%;
        max-width:2rem;
        margin:0;
      }
      div{
        display:flex;
        align-items: center;
        gap:5px;
        justify-content: left;

      }
    </style>
    ```

5.  Mostrar indice con el menu:

```css
// src/layouts/base_layout.css
aside {
  background-color: #23262f;
  padding: 10px;
  position: fixed;
  overflow-y: scroll;
  inset-block: 3rem 0; /* TODO: $1 a var */
}
//...
@media (width >= 50rem) {
  #container {
    // ...
    & > aside {
      width: 20%;
      max-width: 170px;
      inset-block: 4rem 0; /* TODO: $1 a var */
    }
  }
}
```

```css
//styles/global.css
:has(.menu[aria-expanded="true"]) .index {
  display: block !important; // el !important para que sobreescriba el estilo actual
}
```
