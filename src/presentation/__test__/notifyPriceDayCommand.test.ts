import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import NotifyPriceDayCommand from "@presentation/commands/notifyPriceDayCommand";
import { investmentGet } from "./__mocks__/core.mock";

const { backend: { core }, email: { apiUrl } } = new Config().get();

nock(apiUrl).post("/v3.1/send").query(_ => {
    return true;
}).reply(200);
const investmentGetMock = nock(core).get("/v1/investment").query(_ => {
    return true;
});

describe("NotifyPriceDayCommand", ()=>{
    const command = container.resolve(NotifyPriceDayCommand);

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