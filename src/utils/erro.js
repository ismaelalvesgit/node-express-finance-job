class CustomError extends Error{
    _code

    constructor(statusCode, message, code){
        super(message || statusCode);
        this.statusCode = statusCode;
        this._code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class Brapi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, "brapi");
    }
}

export class Currencyapi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, "currencyapi");
    }
}

export class CoreApi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, "coreapi");
    }
}

export class YahooApi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, "yahoo");
    }
}

export class IexCloundApi extends CustomError {
    constructor({statusCode, message }){
        super(statusCode, message, "iexclound");
    }
}