# drag-drop 

![tests](https://github.com/bicycle-codes/drag-drop/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@bicycle-codes/drag-drop?style=flat-square)](./src/index.ts)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![install size](https://flat.badgen.net/packagephobia/install/@bicycle-codes/drag-drop)](https://packagephobia.com/result?p=@bicycle-codes/drag-drop)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [fork](#fork)
- [HTML5 drag & drop for humans](#html5-drag--drop-for-humans)
- [install](#install)
- [live demo](#live-demo)
- [features](#features)
- [usage](#usage)
  * [complete example](#complete-example)
  * [get files as buffers](#get-files-as-buffers)
  * [detect drag-and-dropped text](#detect-drag-and-dropped-text)
  * [detect `dragenter`, `dragover` and `dragleave` events](#detect-dragenter-dragover-and-dragleave-events)
  * [remove listeners](#remove-listeners)
  * [support pasting files from the clipboard](#support-pasting-files-from-the-clipboard)
- [a note about `file://` urls](#a-note-about-file-urls)
- [test](#test)
- [license](#license)

<!-- tocstop -->

</details>

## fork
This is a fork of [feross/drag-drop](https://github.com/feross/drag-drop).

## HTML5 drag & drop for humans

In case you didn't know, the
[HTML5 drag and drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
is a
[total disaster](http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html)!
This is an attempt to make the API usable by mere mortals.

## install

```sh
npm i -S drag-drop
```

## live demo

See [https://instant.io](https://instant.io).

## features

- simple API
- supports files and directories
- excellent browser support (Chrome, Firefox, Safari, Edge)
- adds a `drag` class to the drop target on hover, for easy styling!
- optionally, get the file(s) as a Buffer (see [buffer](https://github.com/feross/buffer))

## API
This package works in the browser via [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) + the [exports field](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#exports) in `package.json`.

```js
import { dragDrop } from '@bicycle-codes/drag-drop'
```

### pre-bundled
This exposes pre-bundled and minifed JS files too. Just copy them to a location accessible to your web server, then link in your HTML:

```sh
cp ./node_modules/@bicycle-codes/drag-drop/dist/index.min.js ./public/drag-drop.min.js
```

```html
<script type="module" src="/drag-drop.min.js"></script>
```

## usage

```js
import { dragDrop } from '@bicycle-codes/drag-drop'

dragDrop('#dropTarget', (files, pos, fileList, directories) => {
  console.log('Here are the dropped files', files) // Array of File objects
  console.log('Dropped at coordinates', pos.x, pos.y)
  console.log('Here is the raw FileList object if you need it:', fileList)
  console.log('Here is the list of directories:', directories)
})
```

Another handy thing this does is add a `drag` class to the drop target when the user
is dragging a file over the drop target. Useful for styling the drop target to make
it obvious that this is a drop target!

### complete example

```js
import { dragDrop } from '@bicycle-codes/drag-drop'

// You can pass in a DOM node or a selector string!
dragDrop('#dropTarget', (files, pos, fileList, directories) => {
  console.log('Here are the dropped files', files)
  console.log('Dropped at coordinates', pos.x, pos.y)
  console.log('Here is the raw FileList object if you need it:', fileList)
  console.log('Here is the list of directories:', directories)

  // `files` is an Array!
  files.forEach(file => {
    console.log(file.name)
    console.log(file.size)
    console.log(file.type)
    console.log(file.lastModifiedDate)
    console.log(file.fullPath) // not real full path due to browser security restrictions
    console.log(file.path) // in Electron, this contains the actual full path

    // convert the file to a Buffer that we can use!
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      // e.target.result is an ArrayBuffer
      const arr = new Uint8Array(e.target.result)
      const buffer = new Buffer(arr)

      // do something with the buffer!
    })
    reader.addEventListener('error', err => {
      console.error('FileReader error' + err)
    })
    reader.readAsArrayBuffer(file)
  })
})
```

### get files as buffers

If you prefer to access file data as Buffers, then just import drag-drop like this:

```js
import { dragDrop } from '@bicycle-codes/drag-grop/buffer'

dragDrop('#dropTarget', files => {
  files.forEach(file => {
    // file is actually a buffer!
    console.log(file.readUInt32LE(0))
    console.log(file.toJSON())
    console.log(file.toString('hex')) // etc...

    // but it still has all the normal file properties!
    console.log(file.name)
    console.log(file.size)
    console.log(file.type)
    console.log(file.lastModifiedDate)
  })
})
```

### detect drag-and-dropped text

If the user highlights text and drags it, we capture that as a separate event.
Listen for it like this:

```js
import { dragDrop } from '@bicycle-codes/drag-drop'

dragDrop('#dropTarget', {
  onDropText: (text, pos) => {
    console.log('Here is the dropped text:', text)
    console.log('Dropped at coordinates', pos.x, pos.y)
  }
})
```

### detect `dragenter`, `dragover` and `dragleave` events

Instead of passing just an `ondrop` function as the second argument, instead pass an
object with all the events you want to listen for:

```js
import { dragDrop } from '@bicycle-codes/drag-drop'

dragDrop('#dropTarget', {
  onDrop: (files, pos, fileList, directories) => {
    console.log('Here are the dropped files', files)
    console.log('Dropped at coordinates', pos.x, pos.y)
    console.log('Here is the raw FileList object if you need it:', fileList)
    console.log('Here is the list of directories:', directories)
  },
  onDropText: (text, pos) => {
    console.log('Here is the dropped text:', text)
    console.log('Dropped at coordinates', pos.x, pos.y)
  },
  onDragEnter: (event) => {},
  onDragOver: (event) => {},
  onDragLeave: (event) => {}
})
```

You can rely on the `onDragEnter` and `onDragLeave` events to fire only for the
drop target you specified. Events which bubble up from child nodes are ignored
so that you can expect a single `onDragEnter` and then a single `onDragLeave`
event to fire.

Furthermore, neither `onDragEnter`, `onDragLeave`, nor `onDragOver` will fire
for drags which cannot be handled by the registered drop listeners. For example,
if you only listen for `onDrop` (files) but not `onDropText` (text) and the user
is dragging text over the drop target, then none of the listed events will fire.

### remove listeners

To stop listening for drag & drop events and remove the event listeners, just use the
`cleanup` function returned by the `dragDrop` function.

```js
import { dragDrop } from '@bicycle-codes/drag-drop'

const cleanup = dragDrop('#dropTarget', files => {
  // ...
})

// ... at some point in the future, stop listening for drag & drop events
cleanup()
```

### support pasting files from the clipboard

To support users pasting files from their clipboard, use the provided
`processItems()` function to process the `DataTransferItemList` from the
browser's native `'paste'` event.

```js
document.addEventListener('paste', event => {
  dragDrop.processItems(event.clipboardData.items, (err, files) => {
    // ...
  })
})
```

## a note about `file://` urls

Don't run your app from `file://`. For security reasons, browsers do not allow you to
run your app from `file://`.  In fact, many of the powerful storage APIs throw errors
if you run the app locally from `file://`.

Instead, start a local server and visit your site at `http://localhost:port`.

## test

Run some very basic tests:
```sh
npm test
```

For more useful tests, I recommend running the example and using it interactively:

```sh
npm start
```

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
