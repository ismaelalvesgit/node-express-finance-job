import { CronJob } from "cron";
import env from "../env";
import { Logger } from "../logger";
import commands from "../commands";
import elasticAgent from "../apm";
import { v4 } from "uuid";

setImmediate(()=>{
    const environment = env.env
    Logger.info("Registered service JOB batch is ON");
    commands.forEach((job)=>{
        const uuid = v4();
        const instance = `${uuid} ${job.name}`;
        const trans = elasticAgent?.startTransaction(instance)
        new CronJob(job.schedule, async ()=>{
            try {
                if(environment === "development" || job.group === "second"){
                    await job.command();
                }
                trans.result = 'success'
            } catch (error) {
                trans.result = 'error'
                elasticAgent?.captureError(error, () => {
                    Logger.error(`Send APM: ${error.message}`);
                });
            }
            trans?.end()
        }, null, true, env.timezone);
    });

    if(environment === "development"){
        Logger.info(`Running ${commands.length} jobs`);
    }else{
        Logger.info(`Not Registered ALL service JOB batch is OFF NODE_ENV is not development is ${environment} registered jobs group "second"`);
    }
})