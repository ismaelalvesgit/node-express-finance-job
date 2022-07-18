import yaml from "js-yaml";
import path from "path";
import { writeFile, readFileSync } from "fs";
import commands from "../commands";
import { Logger } from "../logger";

setImmediate(()=>{
    const doc = yaml.load(readFileSync(path.join(__dirname, "../../scripts/helm/values.yaml"), "utf-8"));
    const env = {};
    const envSecret = {};
    
    Object.keys(doc.env).forEach((key)=>{
        Object.assign(env, {
            [key]: process.env[key]
        });
    });
   
    Object.keys(doc.secret).forEach((key)=>{
        Object.assign(envSecret, {
            [key]: process.env[key]
        });
    });

    doc.env = env;
    doc.secret = envSecret;
    doc.jobs = [];
    commands.forEach((job)=>{
        if(job.group !== "second"){
            doc.jobs.push({
                name: job.name,
                command: job.name,
                schedule: job.schedule,
                labels: {
                    jobgroup: job.group
                },
            });
        }
    });

    writeFile(path.join(__dirname, "../../scripts/helm/values.prod.yaml"), yaml.dump(doc), (err) => {
        if (err) {
            Logger.error(err);
        }
        process.exit(0);
    });
});