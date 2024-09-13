import { randomUUID } from "crypto";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    // @ts-ignore
    private _: number;

    @Column({ name: "external_id", unique: true })
    public readonly id: string;

    @Column({ name: "created_at", type: "timestamptz" })
    public readonly createdAt: Date;

    constructor() {
        this.id = randomUUID();
        this.createdAt = new Date();
    }
}
