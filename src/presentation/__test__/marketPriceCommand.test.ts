import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import MarketPriceCommand from "@presentation/commands/marketPriceCommand";
import { investmentGet } from "./__mocks__/core.mock";
import { getQoute } from "./__mocks__/iexclound.mock";
import { getQoute as brapiQoute } from "./__mocks__/brapi.mock";

const { core, brapi, iexclound } = new Config().get().backend;

nock(iexclound).get(`/v1/data/core/quote/${getQoute.map((qoute)=> qoute.symbol).join(",")}`).query(_ => {
    return true;
}).reply(200, getQoute);
nock(brapi).get(/quote$/).reply(200, brapiQoute);
nock(core).put("/v1/investment/batch").reply(200);
const investmentGetMock = nock(core).get("/v1/investment").query(_ => {
    return true;
});

describe("MarketPriceCommand", ()=>{
    const command = container.resolve(MarketPriceCommand);

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