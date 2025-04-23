/** Allows writting client file as server code, but then convert them to safe strings with no bleeding **/
export declare const ClientWrapper: (method: ($trs: any) => void, bleed?: {
    [key: string]: any;
}) => string;
