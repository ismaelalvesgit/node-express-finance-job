import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import SyncEventsAcaoCommand from "@presentation/commands/syncEventsAcaoCommand";
import { investmentGet } from "./__mocks__/core.mock";
import { investAssetReport } from "./__mocks__/invest.mock";

const { core, invest } = new Config().get().backend;

nock(core).post("/v1/events/batch").reply(200);
nock(invest).post("/acao/getassetreports").query(_ => {
    return true;
}).reply(200, investAssetReport);
const investmentGetMock = nock(core).get("/v1/investment").query(_ => {
    return true;
});

describe("SyncEventsAcaoCommand", ()=>{
    const command = container.resolve(SyncEventsAcaoCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return with success", async () => {
        investmentGetMock.reply(200, investmentGet);

        await expect(command.execute("any")).resolves.not.toThrow();
    });

    it("should return with failed", async () => {
        investmentGetMock.reply(500);
        await expect(command.execute("any")).rejects.toThrow("Request failed with status code 500");
    });
});