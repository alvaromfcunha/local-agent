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
}
