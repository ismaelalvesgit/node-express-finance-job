import { IEntity } from "@helpers/ICommon";

export interface IEvent extends IEntity {
    investmentId: number
    dateReference: string
    dateDelivery: string
    link: string
    description: string
}