import { coreApiService } from "../services";
import { Logger } from "../logger";
import { send } from "../utils/mail";
import env from "../env";
const name = "notify-price-day";
const group = "day";
const schedule = "30 18 * * 1-5";
const deadline = 180;
import * as R from "ramda";

const command = async () => {
    const investments = await coreApiService.getInvestment({
        "sortBy": "changePercentDay", 
        "orderBy": "desc"
    });
    const priceHigh = R.slice(0, 3, investments);
    const priceLow = R.reverse(investments).slice(0, 3);
    
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