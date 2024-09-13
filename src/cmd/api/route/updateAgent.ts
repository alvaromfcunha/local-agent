import { UpdateAgentHandler } from "adapter/input/updateAgent";
import { AgentService } from "adapter/output/agent/agentService";
import { AgentRepository } from "adapter/output/repository/agentRepository";
import { DocumentRepository } from "adapter/output/repository/documentRepository";
import { UpdateAgentUseCase } from "domain/useCase/updateAgent";
import { Request, Response } from "express";
import { DataSource } from "typeorm";

export const updateAgentRoute =
    (dataSource: DataSource) => async (req: Request, res: Response) => {
        const agentRepository = new AgentRepository(dataSource);
        const documentRepository = new DocumentRepository(dataSource);
        const agentService = new AgentService();

        const useCase = new UpdateAgentUseCase(
            agentRepository,
            documentRepository,
            agentService,
        );

        const handler = new UpdateAgentHandler(useCase);

        await handler.handle(req, res);
        return;
    };
