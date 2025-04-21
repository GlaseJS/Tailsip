declare global {
    var $json: typeof jsonWrapper;
    var $view: typeof viewWrapper;
    var $text: typeof textWrapper;
    var $file: typeof fileWrapper;
    var $void: typeof voidWrapper;
}
declare const jsonWrapper: (object: JsonObject) => {
    type: "Json";
    content: JsonObject;
    toString: () => string;
    toJson: () => JsonObject;
    resolve: () => string;
};
declare const viewWrapper: (content: string, trim?: boolean) => {
    type: "View";
    content: string;
    toString: () => string;
    toJson: () => JsonObject;
    resolve: () => string;
};
declare const textWrapper: (content: string, trim?: boolean) => {
    type: "Text";
    content: string;
    toString: () => string;
    toJson: () => JsonObject;
    resolve: () => string;
};
declare const fileWrapper: (path: string) => {
    type: "File";
    content: string;
    toString: () => string;
    toJson: () => JsonObject;
    resolve: () => import("fs").ReadStream;
};
declare const voidWrapper: {
    type: "Void";
    toString: () => string;
    toJson: () => null;
    resolve: () => null;
};
export {};
