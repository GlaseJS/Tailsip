
const globalize = <T>(name: string, value: T): void =>  {
  if (name in global) throw new Error(`Global ${name} already in use.`);
  Object.defineProperty(global, name, {
    value: Object.freeze(value),
    writable: false,
    configurable: false,
    enumerable: false
  });
}

declare global { var $globalize: typeof globalize }
globalize('$globalize', globalize);

const globalizeEach = (values: [string, any][]) => values.forEach(([namespace, value]) => $globalize(namespace, value));
declare global { var $globalizeEach: typeof globalizeEach };
globalize('$globalizeEach', globalizeEach);