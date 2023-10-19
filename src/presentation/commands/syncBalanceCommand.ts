import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICoreService } from "@domain/core/types/ICoreService";

@injectable()
export default class SyncBalanceCommand implements ICommands {

    private name = "sync-balance";
    private group = ECommandSchedule.DAY;
    private schedule = "0 10,20 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService
    ) { }

    async execute(requestId: string): Promise<void> {
        return await this.coreService.syncBalance({requestId});
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
