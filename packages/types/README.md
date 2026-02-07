# @eyeglass/types

Shared TypeScript definitions for the [Eyeglass](https://github.com/donutboyband/eyeglass) visual debugging tool.

## Installation

```bash
npm install @eyeglass/types
```

## Usage

```typescript
import type { SemanticSnapshot, FocusPayload, InteractionStatus } from '@eyeglass/types';
```

## Types

- **`SemanticSnapshot`** - Complete context for a selected UI element (framework info, accessibility, geometry, styles)
- **`FocusPayload`** - Request payload sent from browser to bridge
- **`InteractionStatus`** - Status of an interaction (`idle` | `pending` | `fixing` | `success` | `failed`)
- **`ActivityEvent`** - Real-time events sent to the browser (status updates, thoughts, actions, questions)

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
