---
layout: page.11ty.cjs
title: <kana-control> ⌲ Home
---

# &lt;kana-control>

`<kana-control>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<kana-control>` is just an HTML element. You can it anywhere you can use HTML!

```html
<kana-control></kana-control>
```

  </div>
  <div>

<kana-control></kana-control>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<kana-control>` can be configured with attributed in plain HTML.

```html
<kana-control name="HTML"></kana-control>
```

  </div>
  <div>

<kana-control name="HTML"></kana-control>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<kana-control>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;kana-control&gt;</h2>
    <kana-control .name=${name}></kana-control>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;kana-control&gt;</h2>
<kana-control name="lit-html"></kana-control>

  </div>
</section>
