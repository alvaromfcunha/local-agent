import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base";
import { Agent } from "./agent";

@Entity({ name: "run" })
export class Run extends BaseEntity {
    @Column({ name: "question" })
    public readonly question: string;

    @Column({ name: "output" })
    public readonly output: string;

    @Column({ name: "is_errored" })
    public readonly isErrored: boolean;

    @ManyToOne(() => Agent)
    public agent: Agent;

    constructor(
        agent: Agent,
        question: string,
        output: string,
        isErrored = false,
    ) {
        super();
        this.agent = agent;
        this.question = question;
        this.output = output;
        this.isErrored = isErrored;
    }
}
