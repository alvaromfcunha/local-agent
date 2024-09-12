import { DataSource, Repository } from "typeorm";
import { IAgentRepository } from "domain/repository/agentRepository";
import { Agent } from "domain/entity/agent";

export class AgentRepository implements IAgentRepository {
    private repository: Repository<Agent>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Agent);
    }

    public async create(agent: Agent): Promise<void> {
        try {
            await this.repository.save(agent);
        } catch (error) {
            console.error("Cannot create agent in database", error);
            throw error;
        }
    }
}
