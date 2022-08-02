import knex from "../db";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as brokerModel from "./broker.model";

const TABLE_NAME = "transaction";
export const selectDefault = [
    "id",
    "type",
    "negotiationDate",
    "brokerage",
    "fees",
    "taxes",
    "qnt",
    "price",
    "total",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Transaction
 * @type {Object}
 * @property {Number} id
 * @property {import('../enum/transactionType')} type
 * @property {Date} negotiationDate
 * @property {Number} brokerage
 * @property {Number} fees
 * @property {Number} taxes
 * @property {Number} qnt
 * @property {Number} price
 * @property {Number} total
 * @property {Number} brokerId
 * @property {import("./broker.model").Broker} broker
 * @property {Number} investmentId
 * @property {import("./investment.model").Investment} investment
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Object} options 
 * @param {Transaction} options.where 
 * @param {Transaction} options.date 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllDividensByMonth = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectQuerySelect("broker", brokerModel.selectDefault)),
            knex.raw(`SUM(${TABLE_NAME}.qnt) as qnt`),
        ])
        .sum({ qnt: "qnt" })
        .innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`)
        .groupBy("broker.id");
    if (options?.where) {
        query.where(options?.where);
    }

    if (options?.date) {
        query.where("negotiationDate", "<=", options?.date);
    }
    
    return transacting(query, trx);
};