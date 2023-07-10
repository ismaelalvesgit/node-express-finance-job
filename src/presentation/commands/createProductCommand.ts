import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { IProductService } from "@domain/product/types/IProductService";

@injectable()
export default class CreateProductCommand implements ICommands {

    private name = "async-create-product";
    private group = ECommandSchedule.MINUTE;
    private schedule = "* 5 * * * *";
    private timeout = 180;

    constructor(
        @inject(tokens.ProductService)
        private productService: IProductService
    ) { }

    async execute(identify: string): Promise<void> {
        return this.productService.create({
            name: `ismael alves job - ${identify}`,
            price: 10,
            quantity: 100,
            description: "Raquel is beautiful"
        }, {requestId: identify});
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