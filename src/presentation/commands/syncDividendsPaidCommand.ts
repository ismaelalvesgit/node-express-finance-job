import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICoreService } from "@domain/core/types/ICoreService";

@injectable()
export default class SyncDividendsPaidCommand implements ICommands {

    private name = "sync-dividends-paid";
    private group = ECommandSchedule.DAY;
    private schedule = "0 10 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService
    ) { }

    async execute(requestId: string): Promise<void> {
        return await this.coreService.syncDividendsPaid(new Date(), {requestId});
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
