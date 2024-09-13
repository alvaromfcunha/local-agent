import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "langchain/document";
import { IAgentService } from "domain/service/agentService";
import { OllamaEmbeddings } from "@langchain/ollama";

export class AgentService implements IAgentService {
    public async createEmbeddings(contents: string[]): Promise<number[][]> {
        const docs = contents.map(
            (content) =>
                new Document({
                    pageContent: content,
                    metadata: {},
                }),
        );

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkOverlap: 200,
            chunkSize: 1000,
        });
        const splits = await textSplitter.splitDocuments(docs);

        const ollamaEmbeddings = new OllamaEmbeddings({
            model: process.env.OLLAMA_MODEL,
            baseUrl: process.env.OLLAMA_URL,
        });

        const embeddings = await ollamaEmbeddings.embedDocuments(
            splits.map((splits) => splits.pageContent),
        );

        return embeddings;
    }
}
