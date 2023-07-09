import { inject, injectable } from "tsyringe";
import { ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ISystemService } from "@domain/system/types/ISystemService";

@injectable()
export default class HealthcheckCommand implements ICommands {

    private name = "healthcheck";
    private group = "";
    private schedule = "";
    private timeout = 180;

    constructor(
        @inject(tokens.SystemService)
        private systemService: ISystemService
    ) { }

    async execute(_: string): Promise<void> {
        return this.systemService.healthcheck();
    }

    get props(): ICommandsProps {
        return {
            execute: (identify) => this.execute(identify),
            name: this.name,
            group: this.group,
            schedule: this.schedule,
            timeout: this.timeout,
        };
    }

}