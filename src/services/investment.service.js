import * as investmentModel from "../repository/investment.repository";

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const syncBalance = async(trx) =>{
    return investmentModel.syncBalance(trx);
};
