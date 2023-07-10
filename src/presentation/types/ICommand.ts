export interface ICommandsProps {
    name: string
    group: ECommandSchedule
    schedule: string
    timeout: number
    execute: (identify: string) => Promise<void>
}

export interface ICommands {
    execute(identify: string): Promise<void>
    get props(): ICommandsProps
}

export enum ECommandSchedule {
    NONE = "none",
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "DAY",
    MONTH = "MONTH",
    YEAR = "year",
}