import { dividendsService, transactionService,  iexcloundService, coreApiService} from "../services";
import knex from "../db";
import { Logger } from "../logger";
import env from "../env";
import { parsePercent } from "../utils";
import categoryType from "../enum/categoryType";

const name = "async-divideds-stoke";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.iexclound){
        const investments =  await coreApiService.getInvestment({ 
            "search": { 
                "category.name": [categoryType.EQUITY, categoryType.ETF_INTER] 
            } 
        });
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async(investment)=>{
                try {
                    const { usage } = await iexcloundService.getCreditUsage();
                    if(usage){
                        const dividends = await iexcloundService.findDividens(investment.name.toUpperCase());
                        await Promise.all(dividends.map(async(dividend)=>{
                            const { type, dateBasis, dueDate, price, currency } = dividend;
                            const transactions = await transactionService.findAllDividensByMonth(
                                {investmentId: investment.id}, 
                                dateBasis, 
                                trx
                            );
                            if(dueDate && price){
                                await Promise.all(transactions.map(async(transaction)=>{
                                    const { qnt, broker: { id: brokerId } } = transaction;
                                    const total = Number(qnt) * Number(price);
                                    const dividends = await dividendsService.findOrCreate({
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis,
                                        dueDate,
                                        price,
                                        qnt,
                                        type,
                                        total,
                                        fees: parsePercent(env.system.fees.outsidePercent, total),
                                        currency
                                    }, trx, {
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis,
                                        dueDate,
                                        type,
                                    });
                                    if(dividends && Number(qnt) !== Number(dividends.qnt)){
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
                                        price: ${price}`
                                    );
                                }));
                            }
                        }));
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