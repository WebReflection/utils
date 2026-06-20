declare const _default: <F_1 extends (...args: any[]) => any>(fn: F_1) => CallerOf<F_1>;
export default _default;
export type CallerOf<F_1 extends (...args: any[]) => any> = (thisArg: ThisParameterType<F_1>, ...args: Parameters<F_1>) => ReturnType<F_1>;
