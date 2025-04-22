export declare class Timer {
    autoStart: boolean;
    private start;
    constructor(autoStart?: boolean);
    Start: () => bigint;
    Time: () => number;
    toString: () => string;
}
