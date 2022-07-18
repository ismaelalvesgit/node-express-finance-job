import { CronJob } from "cron";
import env from "../env";
import { Logger } from "../logger";
import commands from "../commands";
import elasticAgent from "../apm";

if(env.env === "development"){
    Logger.info("Registered service JOB batch is ON");
    commands.forEach((job)=>{
        new CronJob(job.schedule, async ()=>{
            try {
                await job.command();
            } catch (error) {
                if (elasticAgent && elasticAgent.isStarted()) {
                    elasticAgent.captureError(error, () => {
                        Logger.error(`Send APM: ${error.message}`);
                    });
                }
            }
        }, null, true, env.timezone);
    });
    Logger.info(`Running ${commands.length} jobs`);
}else{
    commands.forEach((job)=>{
        new CronJob(job.schedule, async ()=>{
            if(job.group === "second"){
                try {
                    await job.command();
                } catch (error) {
                    if (elasticAgent && elasticAgent.isStarted()) {
                        elasticAgent.captureError(error, () => {
                            Logger.error(`Send APM: ${error.message}`);
                        });
                    }
                }
            }
        }, null, true, env.timezone);
    });
    Logger.info(`Not Registered ALL service JOB batch is OFF NODE_ENV is not development is ${env.env} registered jobs group "second"`);
}
