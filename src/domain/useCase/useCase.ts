export type UseCase<I, O> = {
    execute(input: I): Promise<O>;
};
