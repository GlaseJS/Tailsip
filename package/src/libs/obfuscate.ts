
const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
const cache: string[] = [];

export const obfuscate = (id: number) => {
  if (id < cache.length) return cache[id];

  let hash = id;
  for (let i = 0; i < Config.tailsip.idTokenLength * 2; i++)
  {
    hash = 678641 + (hash ^ (hash >>> 3)) * 394673 | 0;
  }

  const chars: string[] = [];
  for (let i = 0; i < Config.tailsip.idTokenLength; i++)
  {
    chars.push(charset[Math.abs(hash % charset.length)] || charset[id % charset.length]);
    hash = (hash * 31 + i * 97 + id) | 0;
  }
  
  return chars.join('');
}

// prime the cache
for (let i = 0; i < Config.tailsip.idTokenCacheSize; i++)
  cache.push(obfuscate(i));