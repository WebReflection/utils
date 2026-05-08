declare const _default: All;
export default _default;
export type All = {
    <T extends object>(obj: T): Promise<{ [K in keyof T]: Awaited<T[K]>; }>;
    <T extends unknown[]>(values: T): Promise<{ [K in keyof T]: Awaited<T[K]>; }>;
    <T extends [unknown, unknown, ...unknown[]]>(...values: T): Promise<{ [K in keyof T]: Awaited<T[K]>; }>;
};
