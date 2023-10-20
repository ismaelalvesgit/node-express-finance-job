import { ECategoryType } from "@domain/core/types/ICategory";
import { Logger } from "@infrastructure/logger/logger";
import archiver from "archiver";
import fs from "fs";

export default class Common { 

    static categoryIsBR(category: ECategoryType){
        if(
            category === ECategoryType.STOCKS ||
            category === ECategoryType.REITS ||
            category === ECategoryType.INDEX_EXT ||
            category === ECategoryType.ETF_EXT
        ) return false;
        return true;
    }

    static diffPercent(value1: number, value2: number){
        const val = ((value1 - value2) / value2) * 100;
        if(isNaN(val) || val === Infinity){
            return 0;
        }
        return val;
    }

    static parsePercent(percent: number, value: number){
        const val = (percent / 100) * value;
        if(isNaN(val) || val === Infinity){
            return 0;
        }
        return val;
    }

    static isValidDate(date: unknown){
        return date instanceof Date;
    }

    static createZipFile(pathfile: string, fileName: string, pathFileZip: string) {
       return new Promise((resolve, reject)=>{
            // create archive (zip)
            const output = fs.createWriteStream(pathFileZip);
            const archive = archiver("zip", {
                zlib: { level: 9 }, // Sets the compression level.
            });

            archive.on("warning", (err: { code: string; }) => {
                if (err.code !== "ENOENT") {
                    reject(err);
                }
            });
          
            // Good practice to catch this error explicitly
            archive.on("error", (err: Error) => {
                reject(err);
            });

            // listen for all archive data to be written
            // 'close' event is fired only when a file descriptor is involved
            output.on("close", function() {
                Logger.info(archive.pointer() + " total bytes");
                Logger.info("archiver has been finalized and the output file descriptor has closed.");
                resolve(pathFileZip);
            });
                    
            archive.pipe(output);
            archive.append(fs.createReadStream(pathfile), {name: fileName});
            archive.finalize();
       });
    }

    static stringToDate(date: string, format: string, delimiter: string){
        const dateItems = date.split(delimiter);
        if(dateItems.length <= 1) return undefined;
        const formatLowerCase = format.toLowerCase();
        const formatItems = formatLowerCase.split(delimiter);
        const monthIndex = formatItems.indexOf("mm");
        const dayIndex = formatItems.indexOf("dd");
        const yearIndex = formatItems.indexOf("yyyy");
        let month = parseInt(dateItems[monthIndex]);
        month -= 1;
        const formatedDate = new Date(Number(dateItems[yearIndex]), month, Number(dateItems[dayIndex]), 3);
        if(!Common.isValidDate(formatedDate)){
            return undefined;
        }
        return formatedDate;
    }
}