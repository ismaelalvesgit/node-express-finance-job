import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICoreService } from "@domain/core/types/ICoreService";
import { EWhereOperator } from "@helpers/ICommon";
import { ECategoryType } from "@domain/core/types/ICategory";
import { Logger } from "@infrastructure/logger/logger";
import { IInvestService } from "@domain/invest/types/IInvestService";

@injectable()
export default class SyncEventsBrdCommand implements ICommands {

    private name = "sync-events-brd";
    private group = ECommandSchedule.DAY;
    private schedule = "0 10,19 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService,

        @inject(tokens.InvestService)
        private investService: IInvestService
    ) { }

    async execute(requestId: string): Promise<void> {
        const investments = await this.coreService.getInvestments({filterBy: [
            `category.name ${EWhereOperator.Equal} ${ECategoryType.BDR}`,
            `balance ${EWhereOperator.GreaterThan} 0`
        ]}, {requestId});

        await Promise.all(investments.items.map(async ({id, name, category}) => {
            try {
                const data = await this.investService.getReport(category.name, name);
                if (data.length > 0) {
                    const events = data.map((event)=>{
                        return {
                            ...event,
                            investmentId: id
                        };
                    });
                    await this.coreService.batchCreatedEvent(events, {requestId});
                }
            } catch (error) {
                Logger.error(`Failed to create events investment: ${name}, Error: ${error}`);
            }
        }));
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
