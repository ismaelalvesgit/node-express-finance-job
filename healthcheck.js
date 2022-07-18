import redisClient from "./src/redis";
import knex from "./src/db";
import { Logger } from "./src/logger";

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
        await knex.raw("select 1+1 as result");
        Logger.info("Ok");
        process.exit(0);
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
});