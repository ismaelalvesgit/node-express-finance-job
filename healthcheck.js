import redisClient from "./src/redis";
import { Logger } from "./src/logger";
import { healthcheck } from "./src/services/coreapi.service";

setImmediate(async()=>{
    try {
        if(redisClient){
            redisClient.ping((err, pong)=>{
                if(err || (pong !== "PONG")){
                    redisClient.quit();
                    throw err;
                }   
            });
        }
        await healthcheck();
        Logger.info("Ok");
        process.exit(0);
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
});