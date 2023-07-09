import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { IProduct } from "./IProduct";

export interface IProductRepository { 
    create(data: IProduct, options?: IHttpAdapterOption): Promise<void>
}