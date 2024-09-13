import { Document } from "domain/entity/document";

export type IDocumentRepository = {
    createMany(documents: Document[]): Promise<void>;
};
