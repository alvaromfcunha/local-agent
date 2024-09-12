import { Agent } from "domain/entity/agent";

export type IAgentRepository = {
    create(agent: Agent): Promise<void>;
};
