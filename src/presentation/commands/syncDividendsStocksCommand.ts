import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICoreService } from "@domain/core/types/ICoreService";
import { EWhereOperator } from "@helpers/ICommon";
import { ECategoryType } from "@domain/core/types/ICategory";
import { Logger } from "@infrastructure/logger/logger";
import { IInvestService } from "@domain/invest/types/IInvestService";
import DateHelper from "@helpers/Date";
import * as R from "ramda";
import { IDividends } from "@domain/core/types/IDividends";
import { Config } from "@config/config";

@injectable()
export default class SyncDividendsStocksCommand implements ICommands {

    private name = "sync-dividends-stocks";
    private group = ECommandSchedule.DAY;
    private schedule = "55 9,18 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService,

        @inject(tokens.InvestService)
        private investService: IInvestService,

        @inject(tokens.Config)
        private config: Config,
    ) { }

    async execute(requestId: string): Promise<void> {
        const content: IDividends[] = [];
        const investments = await this.coreService.getInvestments({filterBy: [
            `category.name ${EWhereOperator.In} ${[ECategoryType.STOCKS, ECategoryType.REITS, ECategoryType.ETF_EXT].toString()}`,
            `balance ${EWhereOperator.GreaterThan} 0`
        ]}, {requestId});

        await Promise.all(investments.items.map(async ({id, name, category}) => {
            try {
                const data = await this.investService.getDividens(category.name, name);
                data.forEach((provent)=>{
                    const { type, currency, dateBasis, dueDate, price } = provent;
                    try {
                        const payload = R.reject(R.isNil, {
                            investmentId: id,
                            type: type,
                            dateBasis: DateHelper.formatDate(DateHelper.stringToDate(dateBasis, "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                            dueDate: DateHelper.formatDate(DateHelper.stringToDate(dueDate, "dd/MM/yyyy", "/"), "yyyy-MM-dd"),
                            price,
                            currency,
                            fees: this.config.get().fees.outsidePercent,
                        });

                        if (R.keys(payload).length > 5) { 
                            content.push(payload as unknown as IDividends);
                        }
                    } catch (error) {
                        Logger.error(`Failed to format provent investment: ${name} - error: ${error}`);
                    }
                });
            } catch (error) {
                Logger.error(`Failed to async dividend investment: ${name} - error: ${error}`);
            }
        }));

        if(content.length > 0){
            await this.coreService.batchCreatedDividends(content, {requestId});
        }
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
