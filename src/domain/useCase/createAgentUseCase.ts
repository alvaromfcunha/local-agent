import { Agent } from "domain/entity/agent";
import { IAgentRepository } from "domain/repository/agentRepository";
import { UseCase } from "./useCase";

export type CreateAgentUseCaseInput = {
    name: string;
};

export type CreateAgentUseCaseOutput = {
    id: string;
};

export class CreateAgentUseCase
    implements UseCase<CreateAgentUseCaseInput, CreateAgentUseCaseOutput>
{
    constructor(private agentRepository: IAgentRepository) {}

    public async execute(
        input: CreateAgentUseCaseInput,
    ): Promise<CreateAgentUseCaseOutput> {
        try {
            const agent = new Agent(input.name);

            await this.agentRepository.create(agent);

            return {
                id: agent.id,
            };
        } catch (error) {
            console.error("Cannot create agent", error);
            throw error;
        }
    }
}
