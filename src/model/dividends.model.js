import knex from "../db";
import dividendsStatus from "../enum/dividendsStatus";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as investmentModel from "./investment.model";
import * as brokerModel from "./broker.model";

const TABLE_NAME = "dividends";
export const selectDefault = [
    "id",
    "status",
    "type",
    "dueDate",
    "dateBasis",
    "qnt",
    "price",
    "total",
    "fees",
    "currency",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Dividends
 * @type {Object}
 * @property {Number} id
 * @property {Number} investmentId
 * @property {import("./investment.model").Investment} investment
 * @property {Number} brokerId
 * @property {import("./broker.model").broker} broker
 * @property {import('../enum/dividendsStatus')} status
 * @property {import('../enum/dividendsType')} type
 * @property {Date} dueDate
 * @property {Date} dateBasis
 * @property {Number} qnt
 * @property {Number} price
 * @property {Number} total
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {string} date 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findUpdateDivideds = (date, trx) => {
    const query = knex(TABLE_NAME)
    .select([
        knex.raw(jsonObjectQuerySelect("investment", investmentModel.selectDefault)),
        knex.raw(jsonObjectQuerySelect("broker", brokerModel.selectDefault)),
        ...selectDefault.map((select) => {
            return `${TABLE_NAME}.${select}`;
        })
    ])
    .innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`)
    .innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`)
    .where(`${TABLE_NAME}.status`, "=", dividendsStatus.PROVISIONED);
    if (date) {
        query.where(`${TABLE_NAME}.dueDate`, "<=", date);
    }
    return transacting(query, trx);
};

/**
 * @param {Dividends} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx, find) => {
    return knex(TABLE_NAME).where(find || data)
        .first()
        .transacting(trx)
        .then(res => {
            if (!res) {
                return knex(TABLE_NAME).insert(data)
                    .transacting(trx)
                    .then(() => {
                        return knex(TABLE_NAME).where(data).first().transacting(trx);
                    });
            } else {
                return res;
            }
        });
};

/**
 * @param {Dividends} where 
 * @param {Dividends} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data, trx) => {
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};