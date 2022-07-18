import apm from "elastic-apm-node";
import env from "./env";
import { Logger } from "./logger";

/** @type {import('elastic-apm-node')} */
let elasticAgent;
if(env.apm.serverUrl){
    elasticAgent = apm.start({
        serviceName: env.apm.serviceName,
        secretToken: env.apm.secretToken,
        apiKey: env.apm.apiKey,
        serverUrl: env.apm.serverUrl,
        cloudProvider: env.apm.cloudProvider
    });
    
    if(!elasticAgent.isStarted()){
        Logger.info("Failed to start APM server");
    }else{
        Logger.info(`Registered service "${env.apm.serviceName}" in APM Server: ${env.apm.serverUrl}`);
    }
}

export default elasticAgent;