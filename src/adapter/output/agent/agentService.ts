import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document as LangchainDocument } from "langchain/document";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { IAgentService } from "domain/service/agentService";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "domain/entity/document";

export class AgentService implements IAgentService {
    public async createEmbeddings(contents: string[]): Promise<number[][]> {
        try {
            const docs = contents.map(
                (content) =>
                    new LangchainDocument({
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
        } catch (error) {
            console.error("Cannot create embeddings in agent service", error);
            throw error;
        }
    }

    public async runAgent(
        documents: Document[],
        question: string,
    ): Promise<string> {
        try {
            const ragPrompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
            const outputParser = new StringOutputParser();
            const ollamaLlm = new ChatOllama({
                model: process.env.OLLAMA_MODEL,
                baseUrl: process.env.OLLAMA_URL,
                temperature: 0,
            });

            const chain = await createStuffDocumentsChain({
                llm: ollamaLlm,
                prompt: ragPrompt,
                outputParser,
            });

            const langchainDocuments = documents.map(
                (document) =>
                    new LangchainDocument({
                        pageContent: document.content,
                        metadata: document.metadata,
                    }),
            );

            const answer = await chain.invoke({
                question,
                langchainDocuments,
            });

            return answer;
        } catch (error) {
            console.error("Cannot run agent in agent service", error);
            throw error;
        }
    }

    public async embedQuery(query: string): Promise<number[]> {
        try {
            const ollamaEmbeddings = new OllamaEmbeddings({
                model: process.env.OLLAMA_MODEL,
                baseUrl: process.env.OLLAMA_URL,
            });

            return ollamaEmbeddings.embedQuery(query);
        } catch (error) {
            console.error("Cannot embed query in agent service", error);
            throw error;
        }
    }
}
