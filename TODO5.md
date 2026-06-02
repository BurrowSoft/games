# GamesMole — TODO5: Adopt Shared RegionalFloatingAd

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports5.md when done.

## Context
TODO4 was committed. Games has its own `LazadaBanner.tsx` — replace with shared component.

## Tasks

### 1. Check AdUnit.tsx
Read `src/components/AdUnit.tsx` — if it is a Google AdSense unit it should stay. If it is another custom ad component, delete it and use `RegionalFloatingAd` instead.

### 2. Replace LazadaBanner with shared RegionalFloatingAd
Delete `src/components/LazadaBanner.tsx`.

In `src/app/layout.tsx`:
```tsx
import { RegionalFloatingAd } from "@burrowsoft/shared";
<RegionalFloatingAd />
```

### 3. Verify packages/shared is up to date
Check `packages/shared/src/components/RegionalFloatingAd.tsx` exists (synced in this session).

## Verify end-to-end
- EN: no floating ad
- TH: Lazada ad appears, dismissible
- SearchBar placeholder in Thai

## Commit and push + fill Reports5.md