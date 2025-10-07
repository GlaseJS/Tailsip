
class TspLogEntry
{
  headers: string[] = [];
  date: Date = new Date();
  message: string = "";

  constructor(
    parts?: string | string[]
  ) {
    if (Array.isArray(parts))
    {
      this.headers = parts.slice(0, -1);
      this.message = parts[parts.length - 1] ?? "";
    }
    else
    {
      this.message = parts ?? "";
    }
  }

  getHeaders() { return this.headers.map((v) => `[${v}]`).join("") }

  // TODO: add coloring resolution
  toConsole()  { return `${this.getHeaders()} ${this.withAnsi()}\x1b[0m` }
  toFile()     { return `${this.date.toUTCString()} ${this.getHeaders()} ${this.withoutAnsi()}` }

  withAnsi()    { return this.message.replace(/\$c(\d+)/g, '\x1b[$1m') }
  withoutAnsi() { return this.message.replace(/\$c(\d+)/g, '')}
}


const log = (strs: TemplateStringsArray, ...exps: any[]) => {
  // Concatenate string
  let str = strs[0];
  for (let i = 0; i < exps.length; i++)
    str += exps[i] + strs[i+1];
  
  const entry = new TspLogEntry(str.split("::"));
  
  // TODO: logging mode
  console.log(entry.toConsole())

  return entry;
}

const err = (strs: TemplateStringsArray, ...exps: any[]) => {
  const entry = log(strs, ...exps);

  // TODO: Error handling (trace resolution)

  return entry;
}


declare global {
  var $log: typeof log
  var $err: typeof err
}
$globalize("$log", log);
$globalize("$err", err);