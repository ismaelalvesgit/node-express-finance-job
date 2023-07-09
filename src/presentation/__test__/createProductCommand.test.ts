import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import CreateProductCommand from "@presentation/commands/createProductCommand";

const url = new Config().get().backend.core;
const requestMock = nock(url);

describe("CreateProductCommand", ()=>{
    const command = container.resolve(CreateProductCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should return with success", async () => {
        requestMock.get("/v1/category").reply(200, {
            items: [{id: "any"}]
        });
        requestMock.post("/v1/product/async").reply(200);
        await expect(command.execute("any")).resolves.not.toThrow();
    });

    it("should return with failed", async () => {
        requestMock.get("/v1/category").reply(200, {
            items: [{id: "any"}]
        });
        requestMock.post("/v1/product/async").reply(500);
        await expect(command.execute("any")).rejects.toThrow("Request failed with status code 500");
    });
});