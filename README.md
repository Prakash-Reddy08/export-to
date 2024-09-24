# export-to

A utility for controlled module exports in Node.js

## Installation

```bash
npm install export-to
```

## Usage

```javascript
import { exportTo } from "export-to";

// Exporting a class
class MyClass {
  /* ... */
}
export const MyControlledClass = exportTo(MyClass, [
  "./AllowedFile1.js",
  "./AllowedFile2.js",
]);

// Exporting a function
function myFunction() {
  /* ... */
}
export const myControlledFunction = exportTo(myFunction, [
  "./AllowedFile1.js",
  "./AllowedFile2.js",
]);

// Exporting an object
const myObject = { key: "value" };
export const myControlledObject = exportTo(myObject, [
  "./AllowedFile1.js",
  "./AllowedFile2.js",
]);

// Exporting a primitive
export const myControlledString = exportTo("Hello, World!", [
  "./AllowedFile1.js",
  "./AllowedFile2.js",
]);
```

Then, in the allowed files, you can import and use these exports:

```javascript
// AllowedFile1.js
import {
  MyControlledClass,
  myControlledFunction,
  myControlledObject,
  myControlledString,
} from "./myModule.js";

const instance = new MyControlledClass();
myControlledFunction();
console.log(myControlledObject.key);
console.log(myControlledString.value); // Note the .value for primitives
```

## API

### exportTo(exportedItem, allowedPaths)

- `exportedItem`: The item to be exported (can be a class, function, object, or primitive)
- `allowedPaths`: An array of file paths that are allowed to import this item

Returns a proxied version of the exported item that checks access before allowing use.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
