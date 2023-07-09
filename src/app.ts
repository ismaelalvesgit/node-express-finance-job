import { inject, injectAll, singleton } from "tsyringe";
import { Command } from "commander";
import { table } from "table";
import { ICommands } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { v4 } from "uuid";
import { CronJob } from "cron";
import { Config } from "@config/config";
import { IApmAdapter } from "@infrastructure/types/IApmAdapter";
import { Logger } from "@infrastructure/logger/logger";

@singleton()
export default class App {

    private program: Command;

    constructor(
        @inject(tokens.ApmClient)
        private apmClient: IApmAdapter,

        @inject(tokens.Config)
        private config: Config,

        @injectAll(tokens.Commands)
        private commands: ICommands[]
    ){
        this.program = new Command();
        this.listAction();
        this.commandsAction();
    }

    private log(msg: unknown) {
        // eslint-disable-next-line no-console
        console.info(msg);
    }

    private listAction(){
        this.program
            .command("list")
            .description("Cron´s list")
            .action(()=>{
                const data = [["Index", "Group", "Scheduling", "Command"]];
                for (let index = 0; index < this.commands.length; index += 1) {
                    const props = this.commands[index].props;
                    data.push([
                      index.toString(),
                      props.group,
                      props.schedule,
                      props.name,
                    ]);
                }

                this.log(`\n${table(data)}`);  
                process.exit(0);
            });   
    }

    private commandsAction(){
        this.commands.forEach((execute, key)=>{
            const command = execute.props;
            const action = async()=>{
                try {
                    await this.executeTask(execute);
                } catch (err) {
                    this.program.error(`${(err as Error).message}`, 
                        { exitCode: 2, code: `${command.name}-error` });
                }
            };

            this.program
                .command(`${key}`)
                .description(`execute ${command.name}`)
                .action(action);
           
            this.program
                .command(command.name)
                .description(`execute ${command.name}`)
                .action(action);
            
            if(command.schedule.length > 0){
                this.program
                    .command("cron")
                    .argument(command.name)
                    .description(`execute ${command.name} by cron`);
            }
        });
    }

    private async executeTask(execute: ICommands, callbackError = true){
        const command = execute.props;
        const uuid = v4();
        const instance = `${uuid}-${command.name}`;
        const apmTransacion = this.apmClient.Agent?.startTransaction(command.name);
        let apmTransacionResult = "sucess";
        let errorExec: Error | null = null;

        try {
            Logger.info(`Starting job ${instance}`);
            await command.execute(uuid);
            Logger.info(`End job ${instance}`);
        } catch (err) {
            Logger.error(`Failed job ${instance}`);
            apmTransacionResult = "error";
            this.apmClient.captureError(err);
            errorExec = err as Error;
        }
        if(apmTransacion){
            apmTransacion.result = apmTransacionResult;
            apmTransacion?.end();
        }
        if(errorExec != null && callbackError){
            throw errorExec;
        }
    }

    private cronJobAction(params: string){
        setImmediate(()=>{
            this.commands.forEach((job)=>{
                const command = job.props;
                if((command.name === params || params.length === 0 ) && command.schedule.length > 0 ){
                    Logger.info(`Register ${command.name} schedule: ${command.schedule} group: ${command.group}`);
                    const timezone = this.config.get().timezone;
                    new CronJob(command.schedule, async()=>{
                        await this.executeTask(job, false);
                    }, null, true, timezone);
                }
            });
        });
    }

    start(){
        this.program
            .command("cron")
            .description("execute all cron job async");

        this.program
            .command("*")
            .action(() => {
                this.log("comando não encontrado");  
                process.exit(0);
            });

        const argv = process.argv;
        if (argv.includes("cron")) {
            const index = argv.indexOf("cron") + 1;
            this.cronJobAction(argv[index] || "");
        }else{
            this.program.exitOverride((err)=>{
                if(err.exitCode > 1){
                    throw err;   
                }
            });
            this.program.parse(argv);
        }
    }
}