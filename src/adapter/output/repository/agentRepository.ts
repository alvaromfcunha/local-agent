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

    public async getById(id: string): Promise<Agent | null> {
        try {
            return await this.repository.findOne({ where: { id: id } });
        } catch (error) {
            console.error(`Cannot get agent by id ${id} in database`, error);
            throw error;
        }
    }

    public async update(agent: Agent): Promise<void> {
        try {
            await this.repository.update(
                { id: agent.id },
                {
                    status: agent.status,
                },
            );
        } catch (error) {
            console.error("Cannot update agent in database", error);
            throw error;
        }
    }
}
