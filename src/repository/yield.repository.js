import env from "../env";
import HttpAdapter from "../utils/axios";
import categoryType from '../enum/categoryType'
import R from "ramda";
import { parseStringToDividendType } from "../utils";
import FormData from "form-data";
import { Logger } from "../logger";

const http = new HttpAdapter({
    baseUrl: env.yieldapi
});

/**
 * @typedef Provent
 * @type {Object}
 * @property {Number} price
 * @property {import('../enum/dividendsType')} type
 * @property {String} dateBasis
 * @property {String} dueDate
 * @property {String} currency
 */

/**
 * @typedef Report
 * @type {Object}
 * @property {Date} dataReferencia
 * @property {Date} dateDelivery
 * @property {String} link
 * @property {String} description
 */


/**
 * 
 * @param {*} data 
 * @returns {Provent[]}
 */
const _formatProvents = (data)=>{
    return data?.assetEarningsModels.map((e)=>{
        return {
            price: e.v,
            type: parseStringToDividendType(e.et),
            dateBasis: e.ed,
            dueDate: e.pd,
            currency: "BRL"
        }
    })
}

/**
 * 
 * @param {*} data 
 * @returns {Report[]}
 */
const _formatReportAcao = (data)=>{
    return data.map((e)=>{
        return {
            dateReference: e.dataReferencia,
            dateDelivery: new Date(),
            link: e.linkPdf,
            description: e.assunto || e.tipo,
        }
    })
}

/**
 * 
 * @param {string} type // FUNDOS IMOBILIÁRIOS, AÇÕES
 * @param {string} ticker
 * @param {0|1|2} years // 0=1º Ano, 1=5º Ano, 2=Máx
 * @returns {Promise<Provent[]>}
 */
export const getDividens = async(type, ticker, years)=>{
    try {
        let url = "/acao/companytickerprovents"
        if(type === categoryType.FIIS) url = "/fii/companytickerprovents"
        const { data } = await http.send({
            url,
            params: R.reject(R.isNil, {
                ticker,
                chartProventsType: years
            })
        })

        return _formatProvents(data)
    } catch (error) {
        Logger.error(`Failed to get provents investment: ${ticker}, Error: ${error}`);
        throw error
    }
}

/**
 * 
 * @param {string} ticker
 * @returns {Promise<Report[]>}
 */
export const getReportAcao = async(ticker)=>{
    try {
        const formData = new FormData();
        formData.append("year", new Date().getFullYear());
        formData.append("code", ticker);
        const { data: { data } } = await http.send({
            url: "/acao/getassetreports",
            data: formData,
            headers: formData.getHeaders(), 
            method: "POST"
        });

        return _formatReportAcao(data)
    } catch (error) {
        Logger.error(`Failed to get report investment: ${ticker}, Error: ${error}`);
        throw error
    }
}

