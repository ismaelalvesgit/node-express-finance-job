import * as dividendsModel from "../model/dividends.model";

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findUpdateDivideds = (date) => {
    return dividendsModel.findUpdateDivideds(date);
};

/**
 * @param {import("../model/dividends.model").Dividends} data
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = async (data, trx, find) => {
    return dividendsModel.findOrCreate(data, trx, find);
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @param {import("../model/dividends.model").Dividends} data 
* @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = async(where, data, trx) => {
    if(data.qnt && data.price){
        data["total"] = Number(data.qnt) * Number(data.price);
    }
    return dividendsModel.update(where, data, trx);
};