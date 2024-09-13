import { Column, Entity, ManyToOne } from "typeorm";
import { Agent } from "./agent";
import { BaseEntity } from "./base";

@Entity({ name: "document" })
export class Document extends BaseEntity {
    @Column({ name: "content" })
    public content: string;

    @Column({ name: "embedding" })
    public embedding!: string;

    @Column({ name: "metadata", type: "json", nullable: true })
    public metadata: Record<string, string> | undefined;

    @ManyToOne(() => Agent, (agent) => agent.documents)
    public readonly agent: Agent;

    constructor(
        agent: Agent,
        content: string,
        embedding: string,
        metadata?: Record<string, string>,
    ) {
        super();
        this.agent = agent;
        this.content = content;
        this.embedding = embedding;
        this.metadata = metadata;
    }
}
