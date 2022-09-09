import knex from "../db";
import transacting from "../utils/transacting";

const TABLE_NAME = "boundList";
export const selectDefault = [
    "id",
    "code",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef BoundList
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

/**
 * @param {BoundList} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};