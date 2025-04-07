


import { createReadStream } from "node:fs";

declare global {
  var $json: typeof jsonWrapper;
  var $view: typeof viewWrapper;
  var $text: typeof textWrapper;
  var $file: typeof fileWrapper;
  var $void: typeof voidWrapper;
}

const jsonWrapper = (object: JsonObject) => ({
  type: "Json" as const,
  content: object,
  toString: () => JSON.stringify(object),
  toJson:   () => object as JsonObject,
  resolve:  () => JSON.stringify(object)
});
global.$json = jsonWrapper;

const viewWrapper = (content: string) => ({
  type: "View" as const,
  content,
  toString: () => content,
  toJson:   () => ({ view: content }) as JsonObject,
  resolve:  () => content
});
global.$view = viewWrapper;

const textWrapper = (content: string) => ({
  type: "Text" as const,
  content,
  toString: () => content,
  toJson:   () => ({ text: content }) as JsonObject,
  resolve:  () => content
});
global.$text = textWrapper;

const fileWrapper = (path: string) => ({
  type: "File" as const,
  content: path,
  toString: () => path,
  toJson:   () => ({ file: path }) as JsonObject,
  resolve:  () => createReadStream(`${process.cwd()}/${path}`)
});
global.$file = fileWrapper;

const voidWrapper = {
  type: "Void" as const,
  toString: () => "",
  toJson:   () => null,
  resolve:  () => null,
};
global.$void = voidWrapper;