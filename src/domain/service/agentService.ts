export type IAgentService = {
    createEmbeddings(docs: string[]): Promise<number[][]>;
    // runAgent(): Promise<unknown>;
};
