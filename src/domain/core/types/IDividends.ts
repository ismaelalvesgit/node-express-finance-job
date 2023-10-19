import { IEntity } from "@helpers/ICommon";
import { IBroker } from "./IBroker";
import { IInvestment } from "./IInvestiment";
import { ICategory } from "./ICategory";

export enum EDividendsStatus {
    PROVISIONED = "PROVISIONED",
    PAID = "PAID",
}

export enum EDividendsType {
    DIVIDEND = "DIVIDEND",
    JCP = "JCP"
}

export interface IDividends extends IEntity {
    broker: IBroker
    brokerId: number
    investmentId: number
    investment: IInvestment
    type: EDividendsType
    dueDate: Date
    dateBasis: Date
    currency: string
    qnt: number
    fees: number
    price: number
    total: number
}

export interface IDividendsChangeStatus extends IDividends {
    category: ICategory
}