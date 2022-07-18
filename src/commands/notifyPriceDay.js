import { investmentService } from "../services";
import { Logger } from "../logger";
import { send } from "../utils/mail";
import env from "../env";

const name = "notify-price-day";
const group = "day";
const schedule = "30 18 * * 1-5";
const deadline = 180;

const command = async () => {
    const priceHigh = await investmentService.findAll(null, "changePercentDay", "desc", 3);
    const priceLow = await investmentService.findAll(null, "changePercentDay", "asc", 3);
    await send({
        to: env.email.notificator,
        subject: "Altas / Baixas do Dia",
        template: "price-day",
        data: {
            url: env.coreApi,
            priceHigh,
            priceLow
        },
    });
    Logger.info("Notify price day sucess");
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};