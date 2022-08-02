import axios from "axios";
import cheerio from "cheerio";
import { coreApiService, dividendsService, transactionService } from "../services";
import knex from "../db";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import { stringToDate, formatAmount, parseStringToDividendType } from "../utils";
import { format } from "date-fns";
import env from "../env";

const name = "async-divideds-fiis";
const group = "day";
const schedule = "55 9 * * 1-5";
const deadline = 180;

const command = async () => {
    if (env.yieldapi) {
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.FIIS } });
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async (investment) => {
                try {
                    const { data } = await axios.get(
                        `${env.yieldapi}/fundos-imobiliarios/${investment.name.toLowerCase()}`
                    );
                    if (data) {
                        const $ = cheerio.load(data);
                        for (let i = 0; i < 4; i++) {
                            const temp = $(`table tr:eq(${i + 1})`).text().split(/\n/);
                            /* eslint-disable no-undef*/
                            const extract = {
                                type: parseStringToDividendType(temp[1]),
                                dateBasis: format(stringToDate(temp[2], "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                                dueDate: format(stringToDate(temp[3], "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                                price: formatAmount(temp[4]),
                            };
                            const { type, dateBasis, dueDate, price } = extract;
                            const transactions = await transactionService.findAllDividensByMonth(
                                { investmentId: investment.id },
                                dateBasis,
                                trx
                            );

                            if (dueDate && price) {
                                await Promise.all(transactions.map(async (transaction) => {
                                    const { qnt, broker: { id: brokerId } } = transaction;
                                    const dividends = await dividendsService.findOrCreate({
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis,
                                        dueDate,
                                        price,
                                        qnt,
                                        type,
                                        total: Number(qnt) * Number(price),
                                    }, trx, {
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis,
                                        dueDate,
                                        type,
                                    });
                                    if (dividends && Number(qnt) !== Number(dividends.qnt)) {
                                        await dividendsService.update(
                                            { id: dividends.id },
                                            { qnt, price },
                                            trx
                                        );
                                    }
                                    Logger.info(`Auto created dividend, 
                                        investment: ${investment.name}, 
                                        broker: ${transaction.broker.name},
                                        dateBasis: ${dateBasis}, 
                                        dueDate: ${dueDate}, 
                                        price: ${price}`,
                                    );
                                }));
                            }
                        }

                    }
                } catch (error) {
                    Logger.error(`Faill to async dividend investment: ${investment.name} - error: ${error}`);
                }
            }));
        });
    }

    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};