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

@injectable()
export default class SyncDividendsFundsCommand implements ICommands {

    private name = "sync-dividends-funds";
    private group = ECommandSchedule.DAY;
    private schedule = "55 9,18 * * 1-5";

    constructor(
        @inject(tokens.CoreService)
        private coreService: ICoreService,

        @inject(tokens.InvestService)
        private investService: IInvestService
    ) { }

    async execute(requestId: string): Promise<void> {
        const content: IDividends[] = [];
        const investments = await this.coreService.getInvestments({filterBy: [
            `category.name ${EWhereOperator.In} ${[
                ECategoryType.FIIS, 
                ECategoryType.FII_AGRO, 
                ECategoryType.FIP, 
                ECategoryType.FIA, 
                ECategoryType.FIDC, 
                ECategoryType.FII_AGRO, 
                ECategoryType.FIINFRA, 
                ECategoryType.FUNDO_SETORIAL
            ].toString()}`,
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
                            currency
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
