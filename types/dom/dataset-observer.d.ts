export type nullish = null | undefined;
export default class extends MutationObserver {
    /**
     * @param {(target:HTMLElement, name:string, oldValue:string|nullish, newValue:string|nullish) => void} interceptor
     */
    constructor(interceptor: (target: HTMLElement, name: string, oldValue: string | nullish, newValue: string | nullish) => void);
    /**
     * Automatically adds `attributes:true` and `attributeOldValue:true`.
     * Allows setting the `subtree` value without hooking into childList.
     * @param {HTMLElement} target
     * @param {{ subtree?: boolean }} [options]
     */
    observe(target: HTMLElement, options?: {
        subtree?: boolean;
    }): void;
}
