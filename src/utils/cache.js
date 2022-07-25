import env from "../env";
import redisClient from "../redis";

export const TIME_DAY = 86400

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @param {import('ioredis').ValueType} value 
 * @param {number} timeExp 
 * @returns {Promise<"OK">}
 */
export const setCache = (key, value, timeExp = TIME_DAY) => {
    if (env.redis.host) {
        return redisClient.set(env.redis.prefix.concat(key), value, "EX", timeExp);
    }
};

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @returns {object}
 */
export const getCache = async (key) => {
    if (env.redis.host) {
        const data = await redisClient.get(env.redis.prefix.concat(key));
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }
};

/**
 * 
 * @param {Array<import('ioredis').KeyType>} key 
 * @returns {Promise<Array<number>>}
 */
export const delCache = (key) => {
    if (env.redis.host) {
        return redisClient.del(key)
    }
};

/**
 * 
 * @param {string} prefix 
 * @returns {void}
 */
export const delPrefixCache = async (prefix) => {
    if (env.redis.host) {
        const keys = await redisClient.keys(`${env.redis.prefix}${prefix}:*`);
        return keys.length > 0 ? redisClient.del(keys) : null;
    }
};

/**
 * 
 * @param {string[]} keys
 * @returns {void}
 */
export const delKeysCache = async (keys) => {
    if (env.redis.host) {
        return Promise.all(keys.map((key)=> delPrefixCache(key)))
    }
};