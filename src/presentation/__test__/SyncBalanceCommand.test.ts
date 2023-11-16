import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import SyncBalanceCommand from "@presentation/commands/syncBalanceCommand";

const { core } = new Config().get().backend;

const investmentGetMock = nock(core).put("/v1/investment/syncBalance");

describe("SyncBalanceCommand", ()=>{
    const command = container.resolve(SyncBalanceCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return with success", async () => {
        investmentGetMock.reply(200);

        await expect(command.execute("any")).resolves.not.toThrow();
    });

    it("should return with failed", async () => {
        investmentGetMock.reply(500);
        await expect(command.execute("any")).rejects.toThrow("Request failed with status code 500");
    });
});