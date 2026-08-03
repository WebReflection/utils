export type ResponseMethod = 'arrayBuffer' | 'blob' | 'bytes' | 'clone' | 'formData' | 'json' | 'text';
export type FetchProxy = Promise<Response> & {
    [K in keyof Response]: K extends ResponseMethod ? Promise<Awaited<ReturnType<Response[K]>>> : Promise<Response[K]>;
};
export default _default;
/**
 * Proxied `fetch` whose result exposes Response fields directly as thenables.
 *
 * @type {(...args: Parameters<typeof globalThis.fetch>) => FetchProxy}
 */
declare function _default(url: URL | RequestInfo, ...rest: [init?: RequestInit | undefined]): FetchProxy;
