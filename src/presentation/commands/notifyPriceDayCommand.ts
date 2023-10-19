import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ISystemService } from "@domain/system/types/ISystemService";
import * as R from "ramda";
import { ICoreService } from "@domain/core/types/ICoreService";
import { Config } from "@config/config";
import { EWhereOperator } from "@helpers/ICommon";

@injectable()
export default class NotifyPriceDayCommand implements ICommands {

    private name = "notify-price-day";
    private group = ECommandSchedule.DAY;
    private schedule = "30 18 * * 1-5";

    constructor(
        @inject(tokens.Config)
        private config: Config,

        @inject(tokens.SystemService)
        private systemService: ISystemService,

        @inject(tokens.CoreService)
        private coreService: ICoreService
    ) { }

    async execute(requestId: string): Promise<void> {
        const investments = await this.coreService.getInvestments({
            orderBy: "changePercentDay", 
            orderByDescending: true, 
            pageSize: 1000,
            filterBy: [`balance ${EWhereOperator.GreaterThan} 0`]
        }, {requestId});
        const priceHigh = R.slice(0, 3, investments.items);
        const priceLow = R.reverse(investments.items).slice(0, 3);

        await this.systemService.sendEmailNotification({
            requestId,
            subject: "Altas / Baixas do Dia",
            to: {
                email: this.config.get().email.notificator,
                name: "Finance Job Service"
            },
            template: "price-day",
            data: {
                url: this.config.get().backend.core,
                priceHigh,
                priceLow
            }
        });
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