import { Run } from "domain/entity/run";

export type IRunRepository = {
    create(run: Run): Promise<void>;
};
