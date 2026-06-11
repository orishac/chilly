import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Reads a sessionStorage key without the extra post-mount render of the
 * useEffect-then-setState pattern. Returns `undefined` while server-rendering
 * and hydrating (sessionStorage is browser-only), then the stored string or
 * `null` on the client.
 */
export function useSessionStorageItem(key: string): string | null | undefined {
  return useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => sessionStorage.getItem(key),
    () => undefined
  );
}
