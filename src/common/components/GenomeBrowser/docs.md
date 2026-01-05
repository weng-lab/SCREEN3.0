# Getting the Browser State

On ANY entity related page, you can call the `useLocalBrowser()` function to generate the browserStore based on session storage. Then you can access any of the store's functions to interact with.

```ts
// Create/Get the local browser store for that particular entity
const browserStore = useLocalBrowser(entity.entityID, entityCoordinates, entity.entityType);

// Examples
const setDomain = browserStore((state) => state.setDomain)
const addHighlight = browserStore((state) => state.addHighlight)
```

> Note: Eventually you will be able to do the same with trackStore
