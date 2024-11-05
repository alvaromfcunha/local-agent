import { NextFunction, Request, Response } from "express";

export const loggingMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(
        "\x1b[2m",
        `[API] ${new Date().toISOString()} | ${req.method} "${req.path}"`,
    );

    const start = performance.now();
    next();
    const end = performance.now();

    console.log(
        "\x1b[1m",
        `[API] ${new Date().toISOString()} | ${req.method} "${req.path}" | ${
            res.statusCode
        } | ${(end - start).toFixed(4)}ms`,
    );
};
