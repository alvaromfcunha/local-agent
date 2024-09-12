import { Request, Response } from "express";
import { DataSource } from "typeorm";
import { AgentRepository } from "adapter/output/repository/agentRepository";
import { CreateAgentHandler } from "adapter/input/createAgent";
import { CreateAgentUseCase } from "domain/useCase/createAgentUseCase";

export const createAgentRoute =
    (dataSource: DataSource) => async (req: Request, res: Response) => {
        const agentRepository = new AgentRepository(dataSource);

        const useCase = new CreateAgentUseCase(agentRepository);

        const handler = new CreateAgentHandler(useCase);

        await handler.handle(req, res);

        return;
    };
