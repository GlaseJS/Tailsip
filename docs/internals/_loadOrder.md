## Modules load order

Internal modules get loaded in a specific order,
meaning they only are made available on the global App object in the given order, and thus only defined then.

- Core/Config: Loads configuration files and make them globaly available in `Config`
- Core/Context: Defines the Context class and make it globaly available through `Context`
- Core/App:
  - Runtime/Logger: Log content in files/console
  - Runtime/Router: Pipe entering context to user route files
  - Runtime/Host: Treat entering requests and dispatch to relevant modules (Router, Static..)