import * as transactionModel from "../model/transaction.model";

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @param {string} date
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<Array<{
 *  broker: import("../model/broker.model").Broker
 *  qnt: number
 * }>>}
 */
export const findAllDividensByMonth = (where, date, trx) => {
    return transactionModel.findAllDividensByMonth({where, date}, trx);
};