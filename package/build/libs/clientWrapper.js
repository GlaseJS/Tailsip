/** Allows writting client file as server code, but then convert them to safe strings with no bleeding **/
export const ClientWrapper = (method, bleed = {}) => {
    let client = method.toString();
    client = client.replace("$tsr", ""); // removes the initial argument since it won't exist
    for (const key in bleed) {
        client = client.replaceAll("$tsr." + key, String(bleed[key]));
    }
    return client.replace(/\/\*[\s\S]*?\*\//g, '');
};
