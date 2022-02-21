# figma-comlink

Comlink endpoint utilities for Figma plugins

## Install

```
npm i figma-comlink
```

or

```
yarn add figma-comlink
```

## Usage

### Exposing plugin methods to the UI

Declare your object you want to expose and call `Comlink`'s `expose` method with an endpoint from `figma-comlink`:

```js
// plugin.js
import * as Comlink from "comlink";
import { uiEndpoint } from "figma-comlink";

const api = {
  foo() {
    return 'bar';
  }
  // If you want to expose figma's built in methods, make sure to wrap it with a `proxy`
  clientStorage: Comlink.proxy({
    getAsync: figma.clientStorage.getAsync,
    setAsync: figma.clientStorage.setAsync,
  }),
}

Comlink.expose(api, uiEndpoint());


```

and then use it from the UI thread like so:

```js
// ui.js
import * as Comlink from "comlink";
import { pluginEndpoint } from "figma-comlink";

const plugin = Comlink.wrap(pluginEndpoint());

plugin.foo()
  .then(console.log) //-> "bar"

```

### Exposing UI methods to the plugin

Define your UI methods:
```js
// ui.js
import * as Comlink from "comlink";
import { pluginEndpoint } from "figma-comlink";

const api = {
  notify(msg) {
    // ... your notification implementation
    window.alert(msg)
  }
};

Comlink.expose(api, pluginEndpoint);

```

add UI endpoint and use your exposed method

```js
// plugin.js
import * as Comlink from "comlink";
import { uiEndpoint } from "figma-comlink";

const ui = Comlink.wrap(uiEndpoint());

ui.notify("Hey ma! I'm sending a notification from plugin thread!")

```

## API

### uiEndpoint 
`() => Comlink.Endpoint`

Creates a UI endpoint. This should be used in your _plugin_ thread.
  
### pluginEndpoint 
`({ targetOrigin, pluginId }?: Options) => Comlink.Endpoint`

`Options`:
  - `targetOrigin?: string`
    Origin on which we should listen and send messages to.
    Defaults to `'*'`
    
  - `pluginId?: string`
    Your plugin ID

Creates a plugin endpoint. This should be used in your _UI_ thread

If your UI lives on a different origin or you have potentially sensitive data, you should pass `pluginId` and `targetOrigin`:

```js
const plugin = Comlink.wrap(
  pluginEndpoint({
    pluginId: "<<your plugin id>>",
    targetOrigin: "https://www.figma.com",
  })
);
```

See more at Figma's docs [here](https://www.figma.com/plugin-docs/creating-ui/#non-null-origin-iframes)
  
