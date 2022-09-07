import axios from "axios";
import { coreApiService } from "../services";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import env from "../env";
import FormData from "form-data";

const name = "async-events-acao";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if (env.yieldapi) {
        const investments = await coreApiService.getInvestment({ "search": { "category.name": categoryType.ACAO } });
        await Promise.all(investments.map(async (investment) => {
            try {
                const formData = new FormData();
                formData.append("year", new Date().getFullYear());
                formData.append("code", investment.name);
                const { data } = await axios.post(`${env.yieldapi}/acao/getassetreports`, formData, {
                    headers: formData.getHeaders()
                });

                if (data.data) {
                    const content = data.data.map((event) => {
                        return {
                            investmentId: investment.id,
                            dateReference: event.dataReferencia,
                            dateDelivery: new Date(),
                            link: event.linkPdf,
                            description: event.assunto || event.tipo,
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