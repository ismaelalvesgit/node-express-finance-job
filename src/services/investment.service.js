import * as investmentModel from "../model/investment.model";

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const syncBalance = async(trx) =>{
    return investmentModel.syncBalance(trx);
};
