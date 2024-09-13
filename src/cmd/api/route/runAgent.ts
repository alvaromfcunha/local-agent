import { RunAgentHandler } from "adapter/input/runAgent";
import { AgentService } from "adapter/output/agent/agentService";
import { AgentRepository } from "adapter/output/repository/agentRepository";
import { RunRepository } from "adapter/output/repository/runRepository";
import { RunAgentUseCase } from "domain/useCase/runAgent";
import { Request, Response } from "express";
import { DataSource } from "typeorm";

export const runAgentRoute =
    (dataSource: DataSource) => async (req: Request, res: Response) => {
        const agentRepository = new AgentRepository(dataSource);
        const runRepository = new RunRepository(dataSource);
        const agentService = new AgentService();

        const useCase = new RunAgentUseCase(
            agentRepository,
            runRepository,
            agentService,
        );

        const handler = new RunAgentHandler(useCase);

        await handler.handle(req, res);
        return;
    };