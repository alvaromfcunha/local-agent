import { Request, Response } from "express";
import { ExpressHandler, ExpressResponse } from "./expressHandler";
import {
    UpdateAgentUseCase,
    UpdateAgentUseCaseInput,
} from "domain/useCase/updateAgent";
import { z, ZodError } from "zod";
import { AgentStatus } from "domain/entity/enum/agentStatus";
import { MissingTrainingDataError } from "domain/error/missingTrainingDataError";
import { TrainingDataToBigError as TrainingDataTooBigError } from "domain/error/trainingDataToBigError";
import { AgentNotFoundError } from "domain/error/agentNotFound";

const updateAgentRequestSchema = z.object({
    agentId: z.string().uuid(),
    status: z.nativeEnum(AgentStatus).optional(),
    documents: z
        .array(
            z.object({
                content: z.string(),
                metadata: z.record(z.string()).optional(),
            }),
        )
        .optional(),
});

type UpdateAgentRequest = z.infer<typeof updateAgentRequestSchema>;

export class UpdateAgentHandler implements ExpressHandler {
    constructor(private useCase: UpdateAgentUseCase) {}

    public async handle(req: Request, res: Response): Promise<void> {
        try {
            const request: UpdateAgentRequest = {
                agentId: req.params.agentId,
                status: req.body?.status,
                documents: req.body?.documents,
            };
            updateAgentRequestSchema.parse(request);

            const input: UpdateAgentUseCaseInput = {
                agentId: request.agentId,
                status: request.status,
                documentsData: request.documents,
            };

            await this.useCase.execute(input);

            res.status(200).send();
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

            if (error instanceof MissingTrainingDataError) {
                res.status(422).send(
                    ExpressResponse.error(
                        "MISSING_TRAINING_DATA",
                        error.message,
                    ),
                );
                return;
            }

            if (error instanceof TrainingDataTooBigError) {
                res.status(422).send(
                    ExpressResponse.error(
                        "TRAINING_DATA_TOO_BIG",
                        error.message,
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

            console.error("Cannot handle update agent request", error);
            res.status(500).send(ExpressResponse.error("INTERNAL_ERROR"));
            return;
        }
    }
}
