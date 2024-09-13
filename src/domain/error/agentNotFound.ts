export class AgentNotFoundError extends Error {
    constructor(id: string) {
        super(`Cannot find agent with id ${id}`);
    }
}
