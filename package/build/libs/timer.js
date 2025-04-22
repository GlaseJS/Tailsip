export class Timer {
    autoStart;
    start;
    constructor(autoStart = true) {
        this.autoStart = autoStart;
        if (autoStart)
            this.Start();
    }
    Start = () => this.start = process.hrtime.bigint();
    Time = () => Number(process.hrtime.bigint() - this.start) / 1_000_000;
    toString = () => `${this.Time().toFixed(3)}ms`;
}
