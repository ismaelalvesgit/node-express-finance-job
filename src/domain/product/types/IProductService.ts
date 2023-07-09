import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { IProduct } from "./IProduct";

export interface IProductService { 
    create(data: Partial<IProduct>, options?: IHttpAdapterOption): Promise<void>
}