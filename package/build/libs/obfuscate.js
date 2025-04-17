const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
const cache = [];
export const obfuscate = (id) => {
    if (id < cache.length)
        return cache[id];
    let hash = id;
    for (let i = 0; i < Config.tailsip.idTokenLength * 2; i++) {
        hash = (hash ^ (hash >>> 3)) * 0x45d9f3b;
        hash = hash & 0xffffffff;
    }
    const chars = [];
    for (let i = 0; i < Config.tailsip.idTokenLength; i++) {
        chars.push(charset[hash % charset.length]);
        hash = Math.floor(hash / charset.length);
    }
    return chars.join('');
};
// prime the cache
for (let i = 0; i < Config.tailsip.idTokenCacheSize; i++)
    cache.push(obfuscate(i));
