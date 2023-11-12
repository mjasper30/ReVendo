# fs.promises

fs.promises polyfill

## Install

This package depends on [Node.js >= 8.9](http://nodejs.org/).

```sh
$ npm install fs.promises
```

## Usage

Enable with a CJS bridge:

**index.js**
```js
require('fs.promises');
```

or enable in the Node CLI with the [`-r` option](https://nodejs.org/api/cli.html#cli_r_require_module):

```shell
node -r fs.promises index.js
```

## License

This software is under the MIT license. See the complete license in:

```
LICENSE
```