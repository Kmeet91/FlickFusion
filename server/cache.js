import NodeCache from 'node-cache';

// Create a new cache instance
// stdTTL: (standard time-to-live) the default expiration for a key in seconds.
// checkperiod: How often the cache will automatically check for and delete expired keys.
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default myCache;