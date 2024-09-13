import { IAgentRepository } from "domain/repository/agentRepository";
import { UseCase } from "./useCase";
import { AgentNotFoundError } from "domain/error/agentNotFound";
import { AgentStatus } from "domain/entity/enum/agentStatus";
import { IAgentService } from "domain/service/agentService";
import { Agent } from "domain/entity/agent";
import { Document } from "domain/entity/document";
import { IDocumentRepository } from "domain/repository/documentRepository";
import { MissingTrainingDataError } from "domain/error/missingTrainingDataError";
import { TrainingDataToBigError } from "domain/error/trainingDataToBigError";

type DocumentData = {
    content: string;
    metadata?: Record<string, string>;
};

export type UpdateAgentUseCaseInput = {
    agentId: string;
    status?: string;
    documentsData?: DocumentData[];
};

export class UpdateAgentUseCase
    implements UseCase<UpdateAgentUseCaseInput, void>
{
    constructor(
        private agentRepository: IAgentRepository,
        private documentRepository: IDocumentRepository,
        private agentService: IAgentService,
    ) {}

    public async execute(input: UpdateAgentUseCaseInput): Promise<void> {
        try {
            const agent = await this.agentRepository.getById(input.agentId);
            if (agent == null) throw new AgentNotFoundError(input.agentId);

            if (input.status != null && input.status !== agent.status) {
                await this.updateStatus(agent, input);
            }
        } catch (error) {
            console.error("Cannot update agent", error);
            throw error;
        }
    }

    private async updateStatus(agent: Agent, input: UpdateAgentUseCaseInput) {
        switch (input.status) {
            case AgentStatus.Training:
                if (
                    input.documentsData == null ||
                    input.documentsData.length === 0
                )
                    throw new MissingTrainingDataError();
                if (input.documentsData.length > 500)
                    throw new TrainingDataToBigError(
                        input.documentsData.length,
                        500,
                    );
                break;
        }

        agent.status = input.status as AgentStatus;
        await this.agentRepository.update(agent);

        switch (input.status) {
            case AgentStatus.Training:
                this.trainAgent(agent, input.documentsData ?? []);
                break;
        }
    }

    private async trainAgent(agent: Agent, documentsData: DocumentData[]) {
        const embeddings = await this.agentService.createEmbeddings(
            documentsData.map((doc) => doc.content),
        );

        const documents = documentsData.map(
            (document, idx) =>
                new Document(
                    document.content,
                    embeddings[idx].join(","),
                    document.metadata,
                ),
        );
        await this.documentRepository.createMany(documents);

        agent.status = AgentStatus.Trained;
        await this.agentRepository.update(agent);
    }
}
