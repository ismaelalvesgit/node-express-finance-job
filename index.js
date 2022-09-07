import { Logger } from "./src/logger";
import { syncBound } from "./src/utils";
import { currencyService } from "./src/services";
import("./src/job");

setImmediate(async() => {
    try {
        await currencyService.updateCache();
        await syncBound();
    } catch (e) {
        Logger.warn(e);
    }
});