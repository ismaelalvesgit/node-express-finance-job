import commander from "commander";
import { table } from "table";
import { v4 } from "uuid";
import elasticAgent from "./apm";
import commands from "./commands";
import env from "./env";
import { Logger } from "./logger";

const program = new commander.Command();

/* Actions */
program
  .command("list")
  .description("lista de crons")
  .action(() => {
    const data = [["Indíce", "Grupo", "Agendamento", "Comando"]];
    for (let index = 0; index < commands.length; index += 1) {
      data.push([
        index.toString(),
        commands[index].group,
        commands[index].schedule,
        commands[index].name,
      ]);
    }

    // eslint-disable-next-line no-console
    console.info(`\n${table(data)}`);

    process.exit(0);
  });

commands.map((command, key) => {
  const action = async () => {
    if (env.isProduction) {
      const uuid = v4();
      const instance = `${uuid} ${command.name}`;
      const trans = elasticAgent?.startTransaction(instance);
      let exitCode;
      try {
        Logger.info(`${instance} start`);
        const message = await command.command();
        trans.result = "success";
        Logger.info(`${instance} end with message: ${message}`);
        exitCode = 0;
      } catch (ex) {
        exitCode = 1;
        trans.result = "error";
        elasticAgent?.captureError(ex, () => {
          Logger.error(`Send APM: ${ex.message}`);
        });
        Logger.error(ex);
      }
      trans?.end();
      process.exit(exitCode);
    } else {
      Logger.info("NODE_ENV is required production");
      process.exit(0);
    }
  };

  program
    .command(`${key}`)
    .description(`executa a cron ${command.name}`)
    .action(action);

  program
    .command(command.name)
    .description(`executa a cron ${command.name}`)
    .action(action);

  return null;
});

program
  .command("*")
  .action((command) => {
    Logger.warn(`comando '${command}' não encontrado`);
    process.exit(1);
  });

setImmediate(() => {
  program.parse(process.argv);
});
