import { Agent } from "domain/entity/agent";

export type IAgentRepository = {
    create(agent: Agent): Promise<void>;
    getById(id: string): Promise<Agent | null>;
    update(agent: Agent): Promise<void>;
};
