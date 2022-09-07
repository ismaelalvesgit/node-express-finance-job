import { iexcloundService, coreApiService} from "../services";
import { Logger } from "../logger";
import env from "../env";
import categoryType from "../enum/categoryType";

const name = "async-divideds-stoke";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.iexclound){
        const content = [];
        const investments =  await coreApiService.getInvestment({ 
            "search": { 
                "category.name": [categoryType.EQUITY, categoryType.ETF_INTER] 
            } 
        });

        await Promise.all(investments.map(async(investment)=>{
            try {
                const { usage } = await iexcloundService.getCreditUsage();
                if(usage){
                    const dividends = await iexcloundService.findDividens(investment.name.toUpperCase());
                    dividends.map((dividend)=>{
                        content.push(Object.assign({
                            investmentId: investment.id,
                            fees: env.system.fees.outsidePercent,
                        }, dividend));
                    });
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