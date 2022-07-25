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
 * @param {Object} params 
 * @returns {Promise<Array<Investment>>}
 */
export const getInvestment = async (params)=>{
    try {
        const { data } = await http.send({
            url: `/investment`,
            method: "GET",
            params
        });

        return data;
    } catch (error) {
        const defaultMessage = "Failed to get investment";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};

/**
 * @returns {Promise<Array<CurrencyAv>>}
 */
export const getAvailable = async ()=>{
    try {
        const { data } = await http.send({
            url: "/xml/available",
            method: "GET"
        });

        return __formatAvailable(JSON.parse(xml2json(data)));
    } catch (error) {
        const defaultMessage = "Failed to get available currency";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "message"],
            error,
        );
        throw new CoreApi({statusCode: error?.response?.status, message});
    }
};
