import { inject, injectable } from "tsyringe";
import { ECommandSchedule, ICommands, ICommandsProps } from "@presentation/types/ICommand";
import { tokens } from "@di/tokens";
import { ISystemService } from "@domain/system/types/ISystemService";
import { format } from "date-fns";
import { Config } from "@config/config";
import mysqldump from "mysqldump";
import { mkdirSync, existsSync, readFileSync } from "fs";
import Common from "@helpers/Common";

@injectable()
export default class BackupCommand implements ICommands {

    private name = "backup-data";
    private group = ECommandSchedule.DAY;
    private schedule = "0 20 * * *";

    constructor(
        @inject(tokens.Config)
        private config: Config,

        @inject(tokens.SystemService)
        private systemService: ISystemService
    ) { }

    async execute(requestId: string): Promise<void> {
        const dir = "./db/backup/";
        const date = format(new Date(), "dd-MM-yyyy");
        const pathZipFile = `${dir}${date}.zip`;
        const pathSqlFile = `${dir}${date}.sql`;

        if (!existsSync(dir)) {
            mkdirSync(dir, {recursive: true});
        }
       
        await mysqldump({
            connection: {
                host: this.config.get().db.host,
                user: this.config.get().db.user,
                password: this.config.get().db.password,
                database: this.config.get().db.database,
            },
            dumpToFile: pathSqlFile,
        });

        await Common.createZipFile(pathSqlFile, `${date}.sql`, pathZipFile);

        await this.systemService.sendEmailNotification({
            requestId,
            subject: `Backup Data ${date}`,
            to: {
                email: this.config.get().email.notificator,
                name: "Finance Job Service"
            },
            template: "bem-vindo",
            attachments: [
                {
                    ContentType: "zip",
                    Filename: `${date}.zip`,
                    ContentID: "id1",
                    Base64Content: readFileSync(pathZipFile).toString("base64")
                }
            ],
            data: {}
        });
    }

    get props(): ICommandsProps {
        return {
            execute: (identify) => this.execute(identify),
            name: this.name,
            group: this.group,
            schedule: this.schedule,
        };
    }

}