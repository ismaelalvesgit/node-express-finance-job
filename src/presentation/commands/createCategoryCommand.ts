import { inject, injectable } from "tsyringe";
import { ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ICategoryService } from "@domain/category/types/ICategoryService";

@injectable()
export default class CreateCategoryCommand implements ICommands {

    private name = "async-create-category";
    private group = "minute";
    private schedule = "30 2 * * * *";
    private timeout = 180;

    constructor(
        @inject(tokens.CategoryService)
        private categoryService: ICategoryService
    ) { }

    async execute(identify: string): Promise<void> {
        return this.categoryService.create({
            name: `ismael alves job - ${identify}`
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