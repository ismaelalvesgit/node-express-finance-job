import * as eventsModel from "../model/events.model";

/**
 * @param {import("../model/events.model").Events} where 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    return eventsModel.findOne(where, trx);
};

/**
 * @param {import("../model/events.model").Events} data 
 * @param {import('knex').Knex.Transaction} trx
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async (data, trx) => {
    return eventsModel.create(data, trx);
};