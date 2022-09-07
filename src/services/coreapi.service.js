import R from "ramda";
import { CoreApi } from "../utils/erro";
import HttpAdapter from "../utils/axios";
import env from "../env";

/**
 * @typedef Category
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} createdAt
 * @property {String} updatedAt
 */

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
 * @property {Category} category
 * @property {String} createdAt
 * @property {String} updatedAt
 */


const http = new HttpAdapter({
    baseUrl: env.coreApi
});


/**
 * 
 * @returns {Promise<void>}
 */
export const healthcheck = async ()=>{
    try {
        await http.send({
            url: "/system/healthcheck",
            method: "GET",      
        });
    } catch (error) {
        const defaultMessage = "Failed healthcheck";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {Object} params 
 * @returns {Promise<Array<Investment>>}
 */
export const getInvestment = async (params)=>{
    try {
        const { data } = await http.send({
            url: "/investment",
            method: "GET",
            params
        });

        return data;
    } catch (error) {
        const defaultMessage = "Failed to get investment";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {Object[]} data 
 * @returns {Promise<void>}
 */
export const batchInvestment = async (data)=>{
    try {
        await http.send({
            url: "/investment/batch",
            method: "PUT",
            data
        });
    } catch (error) {
        const defaultMessage = "Failed to update investments";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {Object[]} data 
 * @returns {Promise<void>}
 */
export const batchCreatedEvent = async (data)=>{
    try {
        await http.send({
            url: "/events/batchCreated",
            method: "POST",
            data
        });
    } catch (error) {
        const defaultMessage = "Failed to create events";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {Object[]} data 
 * @returns {Promise<void>}
 */
export const autoCreateDividends = async (data)=>{
    try {
        await http.send({
            url: "/dividends/autoCreate",
            method: "POST",
            data
        });
    } catch (error) {
        const defaultMessage = "Failed to auto create dividends";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {Date} dueDate 
 * @returns {Promise<void>}
 */
export const autoPaidDividends = async (dueDate)=>{
    try {
        await http.send({
            url: "/dividends/autoPaid",
            method: "POST",
            data: {dueDate}
        });
    } catch (error) {
        const defaultMessage = "Failed to auto paid dividends";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", 0, "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};
