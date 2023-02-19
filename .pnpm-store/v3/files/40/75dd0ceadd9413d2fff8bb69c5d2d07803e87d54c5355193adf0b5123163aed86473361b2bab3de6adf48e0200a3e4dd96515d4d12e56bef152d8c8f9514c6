export declare type Disposables = ReturnType<typeof disposables>;
export declare function disposables(): {
    enqueue(fn: Function): void;
    addEventListener<TEventName extends keyof WindowEventMap>(element: HTMLElement | Window | Document, name: TEventName, listener: (event: WindowEventMap[TEventName]) => any, options?: boolean | AddEventListenerOptions | undefined): () => void;
    requestAnimationFrame(callback: FrameRequestCallback): () => void;
    nextFrame(callback: FrameRequestCallback): () => void;
    setTimeout(callback: (...args: any[]) => void, ms?: number | undefined, ...args: any[]): () => void;
    microTask(cb: () => void): () => void;
    add(cb: () => void): () => void;
    dispose(): void;
    workQueue(): Promise<void>;
    style(node: HTMLElement, property: string, value: string): () => void;
};
