import { randomUUID } from "crypto";
import { AgentStatus } from "./enum/agentStatus";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "agent" })
export class Agent {
    @PrimaryGeneratedColumn({ name: "id" })
    // @ts-ignore
    private _: number;
    @Column({ name: "external_id", unique: true })
    public readonly id: string;
    @Column({ name: "created_at", type: "timestamptz" })
    public readonly createdAt: Date;
    @Column({ name: "status", enum: AgentStatus })
    public status: AgentStatus;

    constructor(public name: string) {
        this.id = randomUUID();
        this.createdAt = new Date();
        this.status = AgentStatus.Created;
    }
}
