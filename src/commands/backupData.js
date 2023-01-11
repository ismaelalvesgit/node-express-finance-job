import { format } from "date-fns";
import { Logger } from "../logger";
import mysqldump from "mysqldump";
import env from "../env";
import { mkdirSync, existsSync, readFileSync } from "fs";
import { send } from "../utils/mail";

const name = "backup-data";
const group = "day";
const schedule = "0 20 * * *";
const deadline = 180;

const command = async () => {
    if (env.jobs.autoBackup) {
        const dir = "./db/backup/";
        const date = format(new Date(), "dd-MM-yyyy");

        if (!existsSync(dir)) {
            mkdirSync(dir, {recursive: true});
        }

        const pathFile = `${dir}${date}.sql.gz`;

        if (env.email.notificator) {
            await mysqldump({
                connection: {
                    host: env.db.host,
                    user: env.db.user,
                    password: env.db.password,
                    database: env.db.database,
                },
                dumpToFile: pathFile,
                compressFile: true,
            })
            await send({
                to: env.email.notificator,
                subject: `Backup Data ${date}`,
                template: "bem-vindo",
                attachments: [
                    {
                        ContentType: 'gzip',
                        Filename: `${date}.sql.gz`,
                        ContentID: "id1",
                        Base64Content: readFileSync(pathFile).toString('base64')
                    }
                ]
            });
            Logger.info(`Backup sucess ${date}`);
        }
    }

    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};