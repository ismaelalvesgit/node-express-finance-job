export interface ICommandsProps {
    name: string
    group: string
    schedule: string
    timeout: number
    execute: (identify: string) => Promise<void>
}

export interface ICommands {
    execute(identify: string): Promise<void>
    get props(): ICommandsProps
}