export interface IEntity {
    id: number
    identify: string
    createdAt: Date
    updatedAt: Date
}

export interface IPagination <T> {
    totalCount: number
    totalPages: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    items: T[]
}

export interface IQueryData {
    page?: number
    pageSize?: number
    orderBy?: string
    filterBy?: string[]
    orderByDescending?: boolean
}

export enum EWhereOperator {
    Equal = "eq",
    NotEqual = "ne",
    GreaterThan = "gt",
    GreaterThanOrEqual = "ge",
    LessThan = "lt",
    LessThanOrEqual = "le",
    Like = "lk"
}
