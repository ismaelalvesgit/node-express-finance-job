import * as yieldRepository from "../repository/yield.repository";

/**
 * 
 * @param {string} type // FUNDOS IMOBILIÁRIOS, AÇÕES
 * @param {string} ticker
 * @param {0|1|2} years // 0=1º Ano, 1=5º Ano, 2=Máx
 * @returns {Promise<import("../repository/yield.repository").Provent[]>}
 */
export const getDividens = (type, ticker, years) =>{
    return yieldRepository.getDividens(type, ticker, years);
};

/**
 * 
 * @param {string} ticker
 * @returns {Promise<import("../repository/yield.repository").Report[]>}
 */
export const getReportAcao = (ticker) =>{
    return yieldRepository.getReportAcao(ticker);
};
