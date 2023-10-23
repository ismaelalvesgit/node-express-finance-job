import { IQoute } from "../types/IIexclound";

export default class IexcloundMapper {

    static toQouteMap(data: IQoute[]): IQoute[] {
        return data.map((qoute)=> {
            return {
                ...qoute,
                logourl: `https://storage.googleapis.com/iex/api/logos/${qoute.symbol}.png`
            };
        });
    }
}