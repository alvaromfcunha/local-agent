export class MissingTrainingDataError extends Error {
    constructor() {
        super("Missing training data.");
    }
}
