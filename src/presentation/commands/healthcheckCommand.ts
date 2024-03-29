import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ISystemService } from "@domain/system/types/ISystemService";

@injectable()
export default class HealthcheckCommand implements ICommands {

    private name = "healthcheck";
    private group = ECommandSchedule.NONE;
    private schedule = "";

    constructor(
        @inject(tokens.SystemService)
        private systemService: ISystemService
    ) { }

    async execute(requestId: string): Promise<void> {
        return this.systemService.healthcheck({requestId});
    }

    get props(): ICommandsProps {
        return {
            execute: (identify) => this.execute(identify),
            name: this.name,
            group: this.group,
            schedule: this.schedule,
        };
    }

}