import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { ICategory } from "./ICategory";

export interface ICategoryService { 
    create(data: Partial<ICategory>, options?: IHttpAdapterOption): Promise<void>
}