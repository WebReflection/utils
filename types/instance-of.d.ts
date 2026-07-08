declare const _default: InstanceOf;
export default _default;
export type InstanceOf = {
    <T extends object>(ref: T, list: Function[]): Function;
};
