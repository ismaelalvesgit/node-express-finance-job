import * as currencyModel from "../model/currency.model";
import { getCache } from "../utils/cache";

/**
 * @returns {Promise<string>}
 */
export const findCache = async() =>{
    const cacheHit = await getCache("currency");
    
    if(cacheHit){
        return cacheHit;
    }

    const data = await currencyModel.findAll();
    return data.map(e => e.code).join(",");
};