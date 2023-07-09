import { IHttpAdapterOption } from "@infrastructure/types/IHttpAdapter";
import { ICategory } from "./ICategory";
import { IPagination, IQueryData } from "@helpers/ICommon";

export interface ICategoryRepository { 
    create(data: ICategory, options?: IHttpAdapterOption): Promise<void>
    find(query?: Partial<IQueryData>, options?: IHttpAdapterOption): Promise<IPagination<ICategory>>
}