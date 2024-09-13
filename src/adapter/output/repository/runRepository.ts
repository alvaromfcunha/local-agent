import { Run } from "domain/entity/run";
import { IRunRepository } from "domain/repository/runRepository";
import { DataSource, Repository } from "typeorm";

export class RunRepository implements IRunRepository {
    private repository: Repository<Run>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Run);
    }

    public async create(run: Run): Promise<void> {
        try {
            await this.repository.save(run);
        } catch (error) {
            console.error("Cannot create run in database", error);
            throw error;
        }
    }
}
