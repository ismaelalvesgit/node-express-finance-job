import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default class DateHelper {
    
    static isValidDate(date: unknown){
        return date instanceof Date;
    }

    static stringToDate(date: string, format: string, delimiter: string){
        const formatLowerCase = format.toLowerCase();
        const formatItems = formatLowerCase.split(delimiter);
        const dateItems = date.split(delimiter);
        const monthIndex = formatItems.indexOf("mm");
        const dayIndex = formatItems.indexOf("dd");
        const yearIndex = formatItems.indexOf("yyyy");
        let month = parseInt(dateItems[monthIndex]);
        month -= 1;
        const formatedDate = new Date(Number(dateItems[yearIndex]), month, Number(dateItems[dayIndex]), 3);
        if(!DateHelper.isValidDate(formatedDate)){
            return null;
        }
        return formatedDate;
    }

    static formatDate(date: Date | number | null,  fmt = "yyyy-MM-dd"){
        if(date == null) return null;
        return format(date, fmt, {locale: ptBR});
    }

    static addDays(date: Date | number, value: number){
        return addDays(date, value);
    }

    static subDays(date: Date | number, value: number){
        return subDays(date, value);
    }
}