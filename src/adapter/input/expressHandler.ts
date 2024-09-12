import { Request, Response } from "express";

export interface ExpressHandler {
    handle(req: Request, res: Response): Promise<void>;
}

export class ExpressResponse {
    public static error(code: string, message?: unknown) {
        return {
            code,
            message,
        };
    }
}
