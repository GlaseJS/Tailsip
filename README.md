# 🌀 Tailsip
> A fullstack web framework built for data, driven by developer intent.

Tailsip is a web framework designed to remove friction between you and your product. It minimizes overhead by promoting a **data-first, declarative, and overridable architecture** — one where everything works out-of-the-box, and anything can be replaced without pain.

## ✨ Why Tailsip?
Most frameworks get in your way by either:
- Demanding manual wiring, endless boilerplate, or complex CLI rituals.
- Or trying to guess everything at runtime, creating hidden behavior and locking you in their designs.

**Tailsip avoids both**, by prioritizing:
- ✅ **Data-Driven Architecture**: structure your app around the shape of your data, not routes or controllers.
- ✅ **Declaration of Intent**: declare what you want, and the framework will figure out how to make it happen.
- ✅ **Full Replaceability**: any primitive, file, or behavior can be disabled, replaced or manually run. No special formats. No *"magic files"*.

## 💾 Core Structures and Concepts
### 1. 🧩 Primitives
Everything in Tailsip is a ***Primitive*** — a self-contained object that knows its type (`kind`), how it's used (`usedAs`), and any dependencies it needs. You can build your app from:
- `$schema` - validate and manipulate data in a controlled manner
- `$itemset` – define schema and validation for data shared with the database all the way to the end user
- `$endpoint` – declare backend logic
- `$view` – render UI using declarative data bindings
- `$socket` - define WS behaviors
- ***...***

Each primitive is fully introspectable and testable. You don’t need to wire anything — just declare it.

### 2. 🎩 Composed Primitives
Sometimes an intent is more complex than a single purpose or goal. In those instances it becomes crucial to be able to merge different primitives together:
- `$form` - interpreted as both an endpoint and a view, layers atop an itemset to complete end to end automatic wiring
- ***...***

> Composed Primitives are treated like any other Primitive, it makes no difference for the system. Is a form a view ? Yes. Is a Form an endpoint ? Yes. Forms are still treated as the primitive types that composes them thus enabling systematic recognition by modules trying to use these primitive types.

### 3. ⚙️ Modules 
***Modules*** are a specific type of Primitive which carries a **lifecycle**. This allows defining what needs to be done upon `.run` or `.close`. Kinds of modules include:
- `$route` - process file-based routing for a specific sub folder (elements declared in those get their path updated).
- `$host` - start the standard HTTP or HTTPS server
- `$ws` - Start a websocket server, or listens in on the existing host
- `$client` - Bundles passed text as client code (often used internally for automations)
- `$registry` - Access existing registered primitives and modules, query through kinds and types
- `$cache` - CLIENT ONLY - Find out what data is already known and fetch missing ones
- `$db` - SERVER ONLY - Fetch on the database using CRUD-like methods
- ***...***

> Most modules have their lifecycle automated as long as they are auto-registered, so declaring them is enough to be set and ready. If you pass `register: false` to a module, you become fully responsible for starting and stopping it.

### 4. 🔧 Minimal boot config, maximal control
Tailsip discovers everything via primitives and registry. Files are scanned and composed automatically at runtime — but without hiding anything from you.

Need full control? Disable the registering and write imports manually. It’s all optional.

## Minimal working example
Less words, more code:
```typescript
const Users = $itemset("User", ({ p, t }) => ({ 
  username: p.string( t("index"),  t("login") ),
  password: p.string( t("secret"), t("login") ) 
}));
type User = $SafeItem<typeof Users>;

$endpoint("login", {
  expects: Users.tagged("login"),
  returns: Users.notTagged("secret"),
  handler: async ({ username, password }) => {
    const exists = $db.find<User>("User", { username });
    if (exists && bcrypt.compare(exists.password, password)) return exists;
    throw new Error("wrong credentials");
  }
});
```
```cli
> npx tailsip
```

## Footnotes
> - If a tool doesn't help you build faster, it should be a tool in the first place.
> - If something has alternatives, it should be replaceable.
> - Data is at the root of networks and websites, it should be at the core of our designs too.
>
> Stop fighting your framework, let it work for you - until you tell it not to.