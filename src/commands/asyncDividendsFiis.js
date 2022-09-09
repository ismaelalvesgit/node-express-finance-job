import { coreApiService, yieldService } from "../services";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import { stringToDate } from "../utils";
import * as R from "ramda";
import env from "../env";
import { format } from "date-fns";

const name = "async-divideds-fiis";
const group = "day";
const schedule = "55 9,18 * * 1-5";
const deadline = 180;

const command = async () => {
    if (env.yieldapi) {
        const content = [];
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.FIIS } });
        await Promise.all(investments.map(async (investment) => {
            try {
                const data = await yieldService.getDividens(categoryType.FIIS, investment.name)
                if (data.length > 0) {
                    data.forEach((provent)=>{
                        const { type, currency, dateBasis, dueDate, price } = provent
                        try {
                            const payload = R.reject(R.isNil, {
                                investmentId: investment.id,
                                type: type,
                                dateBasis: format(stringToDate(dateBasis, "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                                dueDate: format(stringToDate(dueDate, "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                                price,
                                currency
                            });
    
                            if (R.keys(payload).length > 5) { 
                                content.push(payload);
                            }
                        } catch (error) {
                            Logger.error(`Faill to format provent investment: ${investment.name} - error: ${error}`)
                        }
                    })
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