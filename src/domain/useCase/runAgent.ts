import { IAgentRepository } from "domain/repository/agentRepository";
import { UseCase } from "./useCase";
import { IRunRepository } from "domain/repository/runRepository";
import { IAgentService } from "domain/service/agentService";
import { AgentNotFoundError } from "domain/error/agentNotFound";
import { AgentStatus } from "domain/entity/enum/agentStatus";
import { Run } from "domain/entity/run";
import { IDocumentRepository } from "domain/repository/documentRepository";

export type RunAgentUseCaseInput = {
    agentId: string;
    question: string;
};

export type RunAgentUseCaseOutput = {
    id: string;
    answer: string;
};

export class RunAgentUseCase
    implements UseCase<RunAgentUseCaseInput, RunAgentUseCaseOutput>
{
    constructor(
        private agentRepository: IAgentRepository,
        private runRepository: IRunRepository,
        private documentRepository: IDocumentRepository,
        private agentService: IAgentService,
    ) {}

    public async execute(
        input: RunAgentUseCaseInput,
    ): Promise<RunAgentUseCaseOutput> {
        try {
            const agent = await this.agentRepository.getById(input.agentId);
            if (agent == null) throw new AgentNotFoundError(input.agentId);

            if (agent.status !== AgentStatus.Trained)
                throw new Error("Action require a trained agent.");

            const questionEmbedding = await this.agentService.embedQuery(
                input.question,
            );

            const documentsWithScore =
                await this.documentRepository.similaritySearchVectorWithScore(
                    agent,
                    questionEmbedding,
                    4,
                );

            const documents = documentsWithScore.map(
                (documentWithScore) => documentWithScore[0],
            );

            const answer = await this.agentService.runAgent(
                documents,
                input.question,
            );

            const run = new Run(agent, input.question, answer);
            // Fix: too large context error from Ollama.
            await this.runRepository.create(run);

            return {
                id: run.id,
                answer,
            };
        } catch (error) {
            console.error(`Cannot run agent with id ${input.agentId}`, error);
            throw error;
        }
    }
}
