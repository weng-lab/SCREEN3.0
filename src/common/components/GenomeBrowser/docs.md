# Getting the Browser State

On ANY entity related page, you can call the `useLocalBrowser()` function to generate the browserStore based on session storage. Then you can access any of the store's functions to interact with.

```ts
// Create/Get the local browser store for that particular entity
const browserStore = useLocalBrowser({
  name: entity.entityID,
  assembly: entity.assembly,
  entityCoordinates, // the feature itself, highlighted in the view
  browserDomain: expandCoordinates(entityCoordinates, entity.entityType), // the starting view
  type: entity.entityType,
  breakpoint,
});

// Examples
const setDomain = browserStore((state) => state.setDomain)
const addHighlight = browserStore((state) => state.addHighlight)
```

> `useLocalBrowser` does not pad `domain` itself. `expandCoordinates` is applied exactly once per
> browser, in `GenomeBrowserView`, so components passing coordinates down should pass the feature's
> own unpadded coordinates.

> Note: Eventually you will be able to do the same with trackStore
