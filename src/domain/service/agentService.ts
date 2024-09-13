import { Document } from "domain/entity/document";

export type IAgentService = {
    createEmbeddings(documents: string[]): Promise<number[][]>;
    runAgent(documents: Document[], question: string): Promise<string>;
};
