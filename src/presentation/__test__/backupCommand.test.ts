import { container } from "@di/container";
import nock from "nock";
import { Config } from "@config/config";
import BackupCommand from "@presentation/commands/backupCommand";
import Common from "@helpers/Common";

jest.mock("mysqldump", () => jest.fn(() => {}));
const url = new Config().get().email.apiUrl;
const requestMock = nock(url).post("/v3.1/send").query(_ => {
    return true;
});

describe("BackupCommand", ()=>{
    const command = container.resolve(BackupCommand);

    beforeEach(()=>{
        jest.clearAllMocks();
        jest.spyOn(Common, "createZipFile").mockResolvedValueOnce({});
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