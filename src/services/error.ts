//
// Author: Kevin Moyse
//
export class Error {
    public code: number;
    public reason: string;
    public data: any;

    constructor(code: number, reason: string) {
        this.code = code;
        this.reason = reason;
    }

    public static toError(json: any): Error {
        if (json === null) {
            return new Error(-1, "internal error");
        }
        return new Error(json.errorCode || -1, json.errorReason);
    }

    public static build(code: number, reason: string): Error {
        return new Error(code, reason);
    }

    public static map(error: Error, errorMapping: any): Error {
        let reason = errorMapping[error.code] || error.reason;
        return Error.build(error.code, reason);
    }

    public setData(data: any) {
        this.data = data;
    }

    public getData(): any {
        return this.data;
    }
}