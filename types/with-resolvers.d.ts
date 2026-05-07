declare const _default: <T>() => Resolvers<T>;
export default _default;
export type Resolvers<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
