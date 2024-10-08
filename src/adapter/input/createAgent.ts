import {
    CreateAgentUseCase,
    CreateAgentUseCaseInput,
} from "domain/useCase/createAgent";
import { ExpressHandler, ExpressResponse } from "./expressHandler";
import { Request, Response } from "express";
import { z, ZodError } from "zod";

const createAgentRequestSchema = z.object({
    name: z.string(),
});

type CreateAgentRequest = z.infer<typeof createAgentRequestSchema>;

export class CreateAgentHandler implements ExpressHandler {
    constructor(private useCase: CreateAgentUseCase) {}

    public async handle(req: Request, res: Response): Promise<void> {
        try {
            const request: CreateAgentRequest = {
                name: req.body?.name,
            };

            createAgentRequestSchema.parse(request);

            const input: CreateAgentUseCaseInput = {
                name: request.name,
            };

            const output = await this.useCase.execute(input);

            res.status(201).send(output);
            return;
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(
                    ExpressResponse.error(
                        "INVALID_PARAMETERS",
                        error.issues.length
                            ? `Invalid ${error.issues[0].path} provided. ${error.issues[0].message}.`
                            : undefined,
                    ),
                );
                return;
            }

            console.error("Cannot handle create agent request", error);
            res.status(500).send(ExpressResponse.error("INTERNAL_ERROR"));
            return;
        }
    }
}
