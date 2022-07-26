import { iexcloundService, coreApiService, queueService } from "../services";
import { Logger } from "../logger";
import { categoryIsBR, findBrapiQoute } from "../utils";

const name = "update-last-price";
const group = "day";
const schedule = "55 9 * * 1-5";
const deadline = 180;
const router = "update-investment";
const routingKey = "update-investment-data";

const command = async () => {
    const investments = await coreApiService.getInvestment();
    const content = [];
    await Promise.all(investments.map(async (invest) => {
        try {
            const { id } = invest;
            const qoute = categoryIsBR(invest.category.name) ? await findBrapiQoute(invest.category.name, invest.name) :
                await iexcloundService.findQoute(invest.name);
            const previousClosePrice = qoute.regularMarketPrice;
            Logger.info(`Send last price investment: ${invest.name}`);
            content.push({ id, name: invest.name, previousClosePrice });
        } catch (error) {
            Logger.error(`Faill to update investment: ${invest.name} - error: ${error}`);
        }
    }));

    await queueService.publishQeue({
        router,
        routingKey,
        content
    });

    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};