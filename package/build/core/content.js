import { createReadStream } from "node:fs";
const jsonWrapper = (object) => ({
    type: "Json",
    content: object,
    toString: () => JSON.stringify(object),
    toJson: () => object,
    resolve: () => JSON.stringify(object)
});
global.$json = jsonWrapper;
const viewWrapper = (content, trim = true) => ({
    type: "View",
    content,
    toString: () => content,
    toJson: () => ({ view: content }),
    resolve: () => trim ? content.trim().replace(/\s{2,}/g, ' ').replace(/\n/g, '') : content
});
global.$view = viewWrapper;
const textWrapper = (content, trim = true) => ({
    type: "Text",
    content,
    toString: () => content,
    toJson: () => ({ text: content }),
    resolve: () => trim ? content.trim().replace(/\s{2,}/g, ' ').replace(/\n/g, '') : content
});
global.$text = textWrapper;
const fileWrapper = (path) => ({
    type: "File",
    content: path,
    toString: () => path,
    toJson: () => ({ file: path }),
    resolve: () => createReadStream(`${process.cwd()}/${path}`.replaceAll("..", ""))
});
global.$file = fileWrapper;
const voidWrapper = {
    type: "Void",
    toString: () => "",
    toJson: () => null,
    resolve: () => null,
};
global.$void = voidWrapper;
