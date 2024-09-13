import { AgentStatus } from "./enum/agentStatus";
import { Column, Entity, OneToMany } from "typeorm";
import { Document } from "./document";
import { BaseEntity } from "./base";

@Entity({ name: "agent" })
export class Agent extends BaseEntity {
    @Column({ name: "name" })
    public name: string;

    @Column({ name: "status", enum: AgentStatus })
    public status: AgentStatus;

    @OneToMany(() => Document, (document) => document.agent)
    public readonly documents!: Promise<Document[]>;

    constructor(name: string) {
        super();
        this.status = AgentStatus.Created;
        this.name = name;
    }
}
