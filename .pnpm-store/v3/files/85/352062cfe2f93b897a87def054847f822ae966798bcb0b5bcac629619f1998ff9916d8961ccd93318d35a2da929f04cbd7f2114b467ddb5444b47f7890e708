declare type ChangeFn = () => void;
declare type UnsubscribeFn = () => void;
declare type ActionFn<T> = (this: T, ...args: any[]) => T | void;
declare type StoreActions<Key extends string, T> = Record<Key, ActionFn<T>>;
export interface Store<T, ActionKey extends string> {
    getSnapshot(): T;
    subscribe(onChange: ChangeFn): UnsubscribeFn;
    dispatch(action: ActionKey, ...args: any[]): void;
}
export declare function createStore<T, ActionKey extends string>(initial: () => T, actions: StoreActions<ActionKey, T>): Store<T, ActionKey>;
export {};
