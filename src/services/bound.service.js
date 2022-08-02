import * as boundModel from "../model/bound.model";
import { setCache, getCache } from "../utils/cache";

/**
 * @param {import("../model/bound.model").BoundList} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return boundModel.create(data);
};


/**
 * @returns {Promise<void>}
 */
export const updateCache = async() =>{
    const data = await boundModel.findAll();
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

    const data = await boundModel.findAll();
    return data.map(e => e.code).join(",");
};