import cheerio from "cheerio";
import { coreApiService } from "../services";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import env from "../env";
import { format } from "date-fns";
import { stringToDate } from "../utils";
import HttpAdapter from "../utils/axios";

const name = "async-events-fiis";
const group = "day";
const schedule = "0 10,19 * * 1-5";
const deadline = 180;

const http = new HttpAdapter({
    baseUrl: env.yieldapi
});

const command = async () => {
    if (env.yieldapi) {
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.FIIS } });
        await Promise.all(investments.map(async (investment) => {
            try {
                const { data } = await http.send({
                    url: `/fundos-imobiliarios/${investment.name.toLowerCase()}`
                })
                if (data) {
                    const $ = cheerio.load(data);
                    const events = JSON.parse($(".documents > .list").attr()["data-page"]);
                    if(Array.isArray(events)){
                        const eventsFill = events.filter((event) => event.status === 0);
                        const content = eventsFill.map((event) => {
                            let dateReference = format(new Date(), "yyyy-MM-dd");
                            let dateDelivery = format(new Date(), "yyyy-MM-dd");
                            try {
                                dateReference = format(stringToDate(event.dataReferencia, "dd/MM/yyyy", "/"), "yyyy-MM-dd");
                                dateDelivery = format(stringToDate(event.dataEntrega, "dd/MM/yyyy", "/"), "yyyy-MM-dd");
                                // eslint-disable-next-line no-empty
                            } catch (error) { }
                            return {
                                investmentId: investment.id,
                                dateReference,
                                dateDelivery,
                                link: event.link,
                                description: event.description,
                            };
                        });
                        await coreApiService.batchCreatedEvent(content); 
                    }else{
                        Logger.warn(`Failed to convert event investment: ${investment.name}`);
                    }
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