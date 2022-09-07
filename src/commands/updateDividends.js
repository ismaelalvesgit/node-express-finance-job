import { coreApiService } from "../services";

const name = "update-divideds";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    await coreApiService.autoPaidDividends(new Date());
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};