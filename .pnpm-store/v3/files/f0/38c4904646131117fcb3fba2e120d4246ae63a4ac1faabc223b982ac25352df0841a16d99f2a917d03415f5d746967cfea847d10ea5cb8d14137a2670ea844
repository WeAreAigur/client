[remark](https://github.com/remarkjs/remark) plugin to reenable styling
of html tags with 'components' prop in [mdx v2](https://mdxjs.com/).

## What is this?

Let's say you have the following `mdx` file:

```mdx
<h2>Hello one!</h2>

## Hello two!
```

And you use it in your react code like this:

```jsx
import MDXComponent from "./text.mdx";

const componetns = {
  h2: (props) => <h2 className="header" {...props} />,
};

export default function () {
  return <MDXComponent components={components} />;
}
```

Then, in mdx v1 and mdx v2 before `mdx@2.0.0-rc.1`, generated html on the page will be this:

```html
<h2 class="header">Hello one!</h2>

<h2 class="header">Hello two!</h2>
```

But this behavior was changed in `mdx@2.0.0-rc.1`. With this version of mdx, the result will be:

```html
<h2>Hello one!</h2>

<h2 class="header">Hello two!</h2>
```

For the reasons why it was changed, check [this issue](https://github.com/mdx-js/mdx/issues/821).

But now we have a problem because there are a lot of use cases that require you
to use html in your markdown. For example:

```html
<a href="#" download>You can't add params to links without html</a>.

<table>
  <tbody>
    <tr>
      <td>
        <ul>
          <li>You can't use lists inside the table without html.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
```

So, if you have one of these use cases and want to reenable old behavior, you can use this plugin for it.

## Install

**This package is ESM only.**

Install with `npm`:

```
npm install remark-mdx-disable-explicit-jsx
```

Install with `yarn`:

```
yarn add remark-mdx-disable-explicit-jsx
```

### Use

To use with `@mdx-js/loader`, add the plugin to the loader's options inside `webbpack`'s config:

```js
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

// ...

{
  test: /\.mdx?$/,
  use: [
    {
      loader: '@mdx-js/loader',
      options: {
        remarkPlugins: [
          remarkMdxDisableExplicitJsx,
        ]
      }
    }
  ]
}
```

To use directly with `@mdx-js/mdx` `compile`, add the plugin to the options:

```js
import { compile } from "@mdx-js/mdx";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

await compile(file, { remarkPlugins: [remarkMdxDisableExplicitJsx] });
```

To use the plugin with options, add them this way:

```js
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";

// ...

{
  test: /\.mdx?$/,
  use: [
    {
      loader: '@mdx-js/loader',
      options: {
        remarkPlugins: [
          [remarkMdxDisableExplicitJsx, { whiteList: ["h1", "a"] }],
        ]
      }
    }
  ]
}
```

## Options

If the plugin is used without options, it will enable styling for all html tags. If you only
want to enable it for some tags, you can use `whiteList` and `blackList` options.

`options.whiteList`

An array of html tag names. For example, to make `h1` and `a` stylable, use these options:

```
{
    whiteList: ["h1", "a"],
}
```

`options.blackList`

An array of html tag names. For example, to style everything, but `h1`, use these options:

```
{
    blackList: ["h1"],
}
```
