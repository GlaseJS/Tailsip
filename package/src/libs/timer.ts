export class Timer {
  private start!: bigint;

  constructor(public autoStart: boolean = true) {
    if (autoStart) this.Start();
  }

  public Start =    () => this.start = process.hrtime.bigint();
  public Time =     () => Number(process.hrtime.bigint() - this.start) / 1_000_000;
  public toString = () => `${this.Time().toFixed(3)}ms`
}