import { Request, Response } from "express";
import { ExpressHandler, ExpressResponse } from "./expressHandler";
import { RunAgentUseCase, RunAgentUseCaseInput } from "domain/useCase/runAgent";
import { z, ZodError } from "zod";
import { AgentNotFoundError } from "domain/error/agentNotFound";

const runAgentRequestSchema = z.object({
    agentId: z.string().uuid(),
    question: z.string(),
});

type RunAgentRequest = z.infer<typeof runAgentRequestSchema>;

export class RunAgentHandler implements ExpressHandler {
    constructor(private useCase: RunAgentUseCase) {}

    public async handle(req: Request, res: Response): Promise<void> {
        try {
            const request: RunAgentRequest = {
                agentId: req.params.agentId,
                question: req.body?.question,
            };
            runAgentRequestSchema.parse(request);

            const input: RunAgentUseCaseInput = {
                agentId: request.agentId,
                question: request.question,
            };

            const output = await this.useCase.execute(input);

            res.status(200).send(output);
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

            if (error instanceof AgentNotFoundError) {
                res.status(404).send(
                    ExpressResponse.error("AGENT_NOT_FOUND", error.message),
                );
                return;
            }

            console.error("Cannot handle run agent request", error);
            res.status(500).send(ExpressResponse.error("INTERNAL_ERROR"));
            return;
        }
    }
}
