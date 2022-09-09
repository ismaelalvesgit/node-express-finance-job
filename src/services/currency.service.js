import * as currencyRepository from "../repository/currency.repository";
import { getCache } from "../utils/cache";

/**
 * @returns {Promise<string>}
 */
export const findCache = async() =>{
    const cacheHit = await getCache("currency");
    
    if(cacheHit){
        return cacheHit;
    }

    const data = await currencyRepository.findAll();
    return data.map(e => e.code).join(",");
};