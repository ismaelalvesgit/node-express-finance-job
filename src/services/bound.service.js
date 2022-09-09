import * as boundRepository from "../repository/bound.repository";
import { setCache, getCache } from "../utils/cache";

/**
 * @param {import("../repository/bound.repository").BoundList} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return boundRepository.create(data);
};


/**
 * @returns {Promise<void>}
 */
export const updateCache = async() =>{
    const data = await boundRepository.findAll();
    if(data.length){
        const tmp = data.map(e => e.code).join(",");
        await setCache("bound", tmp);
    }
};

/**
 * @returns {Promise<string>}
 */
export const findCache = async() =>{
    const cacheHit = await getCache("bound");
    
    if(cacheHit){
        return cacheHit;
    }

    const data = await boundRepository.findAll();
    return data.map(e => e.code).join(",");
};