import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import HealthcheckCommand from "@presentation/commands/healthcheckCommand";

const url = new Config().get().backend.core;
const requestMock = nock(url).get("/v1/system/healthcheck");

describe("HealthcheckCommand", ()=>{
    const command = container.resolve(HealthcheckCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return with success", async () => {
        requestMock.reply(200);
        await expect(command.execute("any")).resolves.not.toThrow();
    });

    it("should return with failed", async () => {
        requestMock.reply(500);
        await expect(command.execute("any")).rejects.toThrow("Request failed with status code 500");
    });
});