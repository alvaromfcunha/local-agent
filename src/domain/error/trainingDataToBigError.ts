export class TrainingDataToBigError extends Error {
    constructor(length: number, limit: number) {
        super(`Training data length is ${length}. Must be >${limit}.`);
    }
}
