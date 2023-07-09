import { inject, injectable } from "tsyringe";
import { ICategoryService } from "../types/ICategoryService";
import { tokens } from "@di/tokens";
import { ICategoryRepository } from "../types/ICategoryRepository";
import { ICategory } from "../types/ICategory";
import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";

@injectable()
export default class CategoryService implements ICategoryService {

    constructor(
        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository
    ) { }

    create(data: ICategory, options?: IHttpAdapterOption): Promise<void> {
        return this.categoryRepository.create(data, options);
    }
}