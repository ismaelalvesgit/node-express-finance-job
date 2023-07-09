import { inject, injectable } from "tsyringe";
import { IProductService } from "../types/IProductService";
import { tokens } from "@di/tokens";
import { IProductRepository } from "../types/IProductRepository";
import { IProduct } from "../types/IProduct";
import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { ICategoryRepository } from "@domain/category/types/ICategoryRepository";

@injectable()
export default class ProductService implements IProductService {

    constructor(
        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,

        @inject(tokens.ProductRepository)
        private productRepository: IProductRepository
    ) { }

    async create(data: IProduct, options?: IHttpAdapterOption): Promise<void> {
        const categorys = await this.categoryRepository.find();
        if (categorys.items.length === 0) {
            throw new Error("Category not found");
        }
        data.categoryId = categorys.items[0].id;
        return this.productRepository.create(data, options);
    }
}