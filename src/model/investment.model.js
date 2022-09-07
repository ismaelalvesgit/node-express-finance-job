import knex from "../db";
import transacting from "../utils/transacting";

const TABLE_NAME = "investment";

export const selectDefault = [
    "id",
    "name",
    "longName",
    "logoUrl",
    "balance",
    "currency",
    "sector",
    "volumeDay",
    "previousClosePrice",
    "changePercentDay",
    "variationDay",
    "changePercentTotal",
    "variationTotal",
    "priceDay",
    "priceDayHigh",
    "priceDayLow",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Investment
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} longName
 * @property {Number} balance
 * @property {String} sector
 * @property {Number} volumeDay
 * @property {Number} previousClosePrice
 * @property {Number} changePercentDay
 * @property {Number} variationDay
 * @property {Number} changePercentTotal
 * @property {Number} variationTotal
 * @property {Number} priceDay
 * @property {Number} priceDayHigh
 * @property {Number} priceDayLow
 * @property {Number} categoryId
 * @property {import("./category.model").Category} category
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<{balance: number}>}
 */
export const syncBalance = (trx) => {
    const query = knex(TABLE_NAME)
        .select(
            `${TABLE_NAME}.id`,
            `${TABLE_NAME}.name`,
            `${TABLE_NAME}.balance`,
            knex.raw("TRUNCATE(SUM(transaction.total), 2) as asyncBalance"),
        )
        .innerJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
        .groupBy(`${TABLE_NAME}.id`);

    return transacting(query, trx);
};