import { Agent } from "domain/entity/agent";
import { Document } from "domain/entity/document";

export type IDocumentRepository = {
    createMany(documents: Document[]): Promise<void>;
    similaritySearchVectorWithScore(
        agent: Agent,
        embedding: number[],
        documentCount: number,
        metadataFilter?: {},
    ): Promise<[Document, number][]>;
};
