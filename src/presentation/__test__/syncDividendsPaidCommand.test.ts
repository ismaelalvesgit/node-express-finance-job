import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import SyncDividendsPaidCommand from "@presentation/commands/syncDividendsPaidCommand";

const { core } = new Config().get().backend;

const coreRequest = nock(core).post("/v1/dividends/autoPaid");

describe("SyncDividendsPaidCommand", ()=>{
    const command = container.resolve(SyncDividendsPaidCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return with success", async () => {
        coreRequest.reply(200);
        
        await expect(command.execute("any")).resolves.not.toThrow();
    });

    it("should return with failed", async () => {
        coreRequest.reply(500);
        await expect(command.execute("any")).rejects.toThrow("Request failed with status code 500");
    });
});