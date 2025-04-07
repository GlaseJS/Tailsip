import { createReadStream } from "node:fs";
const jsonWrapper = (object) => ({
    type: "Json",
    content: object,
    toString: () => JSON.stringify(object),
    toJson: () => object,
    resolve: () => JSON.stringify(object)
});
global.$json = jsonWrapper;
const viewWrapper = (content) => ({
    type: "View",
    content,
    toString: () => content,
    toJson: () => ({ view: content }),
    resolve: () => content
});
global.$view = viewWrapper;
const textWrapper = (content) => ({
    type: "Text",
    content,
    toString: () => content,
    toJson: () => ({ text: content }),
    resolve: () => content
});
global.$text = textWrapper;
const fileWrapper = (path) => ({
    type: "File",
    content: path,
    toString: () => path,
    toJson: () => ({ file: path }),
    resolve: () => createReadStream(`${process.cwd()}/${path}`)
});
global.$file = fileWrapper;
const voidWrapper = {
    type: "Void",
    toString: () => "",
    toJson: () => null,
    resolve: () => null,
};
global.$void = voidWrapper;
