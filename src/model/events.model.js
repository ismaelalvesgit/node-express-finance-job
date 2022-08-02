import knex from "../db";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as investmentModel from "./investment.model";

const TABLE_NAME = "events";
export const selectDefault = [
    "id",
    "dateReference",
    "dateDelivery",
    "assetMainId",
    "link",
    "description",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Events
 * @type {Object}
 * @property {Number} id
 * @property {Number} investmentId
 * @property {import("./investment.model").Investment} investment
 * @property {Date} dateReference
 * @property {Date} dateDelivery
 * @property {Number} assetMainId
 * @property {String} link
 * @property {String} description
 * @property {String} createdAt
 * @property {String} updatedAt
 */


/**
 * @param {Events} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    const query = knex(TABLE_NAME)
        .first()
        .select([
            knex.raw(jsonObjectQuerySelect("investment", investmentModel.selectDefault)),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            })
        ])
        .innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`);

    Object.keys(where).forEach((key) => {
        query.where(`${TABLE_NAME}.${key}`, "=", where[key]);
    });

    return transacting(query, trx);
};

/**
 * @param {Dividends} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};