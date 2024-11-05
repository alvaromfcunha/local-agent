import { Agent } from "domain/entity/agent";
import { Document } from "domain/entity/document";
import { IDocumentRepository } from "domain/repository/documentRepository";
import { DataSource, Repository } from "typeorm";

export class DocumentRepository implements IDocumentRepository {
    private repository: Repository<Document>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Document);
    }

    public async createMany(documents: Document[]): Promise<void> {
        try {
            await this.repository.save(documents);
        } catch (error) {
            console.error("Cannot create documents in database", error);
            throw error;
        }
    }

    public async similaritySearchVectorWithScore(
        agent: Agent,
        embedding: number[],
        documentCount: number,
        metadataFilter = {},
    ): Promise<[Document, number][]> {
        try {
            const embeddingString = `[${embedding.join(",")}]`;
            const metadataFilterString = JSON.stringify(metadataFilter);

            const queryString = `
                SELECT 
                    *,
                    embedding <=> $1 as "_distance"
                FROM 
                    document
                WHERE 
                    metadata @> $2 AND
                    _agent = $3
                ORDER BY "_distance" ASC
                LIMIT $4;`;

            const documentRecords = await this.repository.query(queryString, [
                embeddingString,
                metadataFilterString,

                documentCount,
            ]);

            const results: [Document, number][] = [];
            for (const documentRecord of documentRecords) {
                if (
                    documentRecord._distance != null &&
                    documentRecord.pageContent != null
                ) {
                    const document = Document.load(
                        documentRecord.external_id,
                        documentRecord.created_at,
                        agent,
                        documentRecord.content,
                        documentRecord.embedding,
                        documentRecord.metadata,
                    );
                    results.push([document, documentRecord._distance]);
                }
            }

            return results;
        } catch (error) {
            console.error(
                "Cannot similarty search documents in database",
                error,
            );
            throw error;
        }
    }
}
