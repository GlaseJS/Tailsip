interface Id {};
class Id {
  constructor (private readonly value: string) {}

  public Value    = () => this.value;
  public toString = () => this.value;
  public toJSON   = () => this.value;
}

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
type JsonObject = { [x: string]: JsonValue };

interface Json {};
class Json {
  constructor (private readonly value: JsonObject) {}

  public Value    = () => this.value;
  public toString = () => JSON.stringify(this.value);
  public toJSON   = () => this.value;

  public static fromString = (str: string) => new Json(JSON.parse(str));
}

interface Binary {};
class Binary {
  constructor (private readonly value: Uint8Array) {}

  public Value    = () => this.value;
  public Buffer   = () => Buffer.from(this.value);
  public toString = () => this.value.toString();
  public toJSON   = () => this.value.toString();
}



type TspBaseStringTypes = "string" | "number" | "boolean" | "date" | "id" | "json" | "binary";
type TspStringTypes =
  TspBaseStringTypes |
  `${TspBaseStringTypes}?` |
  `${TspBaseStringTypes}[]`;

type TypeMap = { [x in TspBaseStringTypes]: unknown };
type TspTypeMap = {
  "string":  string,
  "number":  number,
  "boolean": boolean,
  "date":    Date,
  "id":      Id,
  "json":    Json,
  "binary":  Binary,
};
const TspStringTypeMap = {
  "string":  "string",
  "number":  "number",
  "boolean": "boolean",
  "date":    "Date",
  "id":      "Id",
  "json":    "Json",
  "binary":  "Binary",
}

type Resolve<T extends TspStringTypes, TM extends TypeMap = TspTypeMap> =
  T extends `${infer x extends TspBaseStringTypes}[]` ? Resolve<x, TM>[] :
  T extends `${infer x extends TspBaseStringTypes}?` ? Resolve<x, TM> | undefined :
  T extends TspBaseStringTypes ? TM[T] : never;

type SchemaProperty<T extends TspStringTypes> = {
  type: T,

  secret?: boolean,

  create?: () => Resolve<T>;
  update?: () => Resolve<T>;
  validate?: (value: Resolve<T>) => boolean;
  transform?: (value: Resolve<T>) => Resolve<T>;
}



const createdAt = { type: "string", create: () => new Date() };
const updatedAt = { type: "string", update: () => new Date() };

type Ref = typeof Ref;
const Ref = (model: string) => ({ type: "ref", model } as const);



type BaseSchema = {
  [x: string]: SchemaProperty<TspStringTypes> | ReturnType<Ref>
}
const NarrowSchema = <S extends BaseSchema>(schema: S) => schema;
type Schema = ReturnType<typeof NarrowSchema>;


