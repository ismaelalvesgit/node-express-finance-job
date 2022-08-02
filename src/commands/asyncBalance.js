import { investmentService, queueService } from "../services";
import { Logger } from "../logger";

const name = "async-balance";
const group = "day";
const schedule = "0 10,20 * * 1-5";
const deadline = 180;
const router = "update-investment";
const routingKey = "update-investment-data";

const command = async () => {
    const data = await investmentService.syncBalance();
    const content = [];
    await Promise.all(data.map(async (invest) => {
        const { id, name: investment, balance, asyncBalance } = invest;
        try {
            if (Number(balance) !== Number(asyncBalance)) {
                content.push({
                    id,
                    name: investment,
                    balance: asyncBalance
                });
                Logger.info(`Aync Balance Investment ${investment}`);
            }
        } catch (error) {
            Logger.error(`Falied to async balance investment ${investment}, error: ${error}`);
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