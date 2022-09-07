import axios from "axios";
import cheerio from "cheerio";
import { coreApiService } from "../services";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import { stringToDate, formatAmount, parseStringToDividendType } from "../utils";
import * as R from "ramda";
import env from "../env";
import { format } from "date-fns";

const name = "async-divideds-acao";
const group = "day";
const schedule = "55 9 * * 1-5";
const deadline = 180;

const command = async () => {
    if (env.yieldapi) {
        const content = [];
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.ACAO } });
        await Promise.all(investments.map(async (investment) => {
            try {
                const { data } = await axios.get(`${env.yieldapi}/acoes/${investment.name.toLowerCase()}`);
                if (data) {
                    const $ = cheerio.load(data);
                    for (let i = 0; i < 4; i++) {
                        const temp = $(`table tr:eq(${i + 1})`).text().split(/\n/);
                        /* eslint-disable no-undef*/
                        const payload = R.reject(R.isNil, {
                            investmentId: investment.id,
                            type: parseStringToDividendType(temp[1]),
                            dateBasis: format(stringToDate(temp[2], "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                            dueDate: format(stringToDate(temp[3], "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                            price: formatAmount(temp[4]),
                        });

                        if (R.keys(payload).length > 4) { 
                            content.push(payload);
                        }
                    }
                }
            } catch (error) {
                Logger.error(`Faill to async dividend investment: ${investment.name} - error: ${error}`);
            }
        }));

        if(content.length > 0){
            await coreApiService.autoCreateDividends(content);
        }
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