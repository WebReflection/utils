export default class extends MutationObserver {
    /**
     * @param {(target:HTMLElement, name:string, oldValue:string|undefined|null, newValue:string|undefined|null) => void} interceptor
     */
    constructor(interceptor: (target: HTMLElement, name: string, oldValue: string | undefined | null, newValue: string | undefined | null) => void);
    /**
     * Automatically adds `attributes:true` and `attributeOldValue:true`.
     * @param {HTMLElement} target
     * @param {{ subtree?: boolean, childList?: boolean }} [options]
     */
    observe(target: HTMLElement, options?: {
        subtree?: boolean;
        childList?: boolean;
    }): void;
}
