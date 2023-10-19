import { IEntity } from "@helpers/ICommon";

export enum ECategoryType {
    FIIS = "FIIS",
    FII_AGRO = "FII_AGRO", // Fundos de Agronegócio
    FIP = "FIP", // Fundo de Investimento em Participações
    FIA = "FIA", // Fundos de Investimentos de Ações
    FIDC = "FIDC", // Fundo de Investimento em Direitos Creditórios
    FIINFRA = "FIINFRA", // Fundo de investimento em infraestrutura
    FUNDO_SETORIAL = "FUNDO_SETORIAL", // Fundos setoriais
    ACAO = "ACAO",
    CRIPTOMOEDA = "CRIPTOMOEDA",
    STOCKS = "STOCKS",
    REITS = "REITS",
    ETF = "ETF",
    ETF_EXT = "ETF_EXT",
    TESOURO = "BOND",
    INDEX = "INDEX",
    INDEX_EXT = "INDEX_EXT",
    BDR = "BDR",
}

export interface ICategory extends IEntity {
    name: ECategoryType
    imageUrl: string
}