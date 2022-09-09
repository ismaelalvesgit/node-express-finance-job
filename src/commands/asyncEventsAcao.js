import { coreApiService, yieldService } from "../services";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import env from "../env";

const name = "async-events-acao";
const group = "day";
const schedule = "0 10,19 * * 1-5";
const deadline = 180;

const command = async () => {
    if (env.yieldapi) {
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.ACAO } });
        await Promise.all(investments.map(async (investment) => {
            try {
                const data = await yieldService.getReportAcao(investment.name)
                if (data.length > 0) {
                    const content = data.map((event) => {
                        return {
                            investmentId: investment.id,
                            ...event
                        };
                    });
                    await coreApiService.batchCreatedEvent(content);
                }
            } catch (error) {
                Logger.error(`Failed to create events investment: ${investment.name}, Error: ${error}`);
            }
        }));
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