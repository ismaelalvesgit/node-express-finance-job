import knex from "../db";
import transacting from "../utils/transacting";

const TABLE_NAME = "currencyFavorite";
export const selectDefault = [
    "id",
    "code",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef CurrencyFavorite
 * @type {Object}
 * @property {Number} id
 * @property {String} code
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (trx) => {
    const query = knex(TABLE_NAME);
    return transacting(query, trx);
};