# Eyeglass Bookmarklet

For quick testing, you can use this bookmarklet to inject the inspector into any page.

## Setup

1. Start the bridge server: `npm run dev:bridge`
2. Create a new bookmark with this URL:

```
javascript:(function(){const s=document.createElement('script');s.src='http://localhost:3300/inspector.js';document.head.appendChild(s);})();
```

## Alternative: CDN (once published)

```
javascript:(function(){const s=document.createElement('script');s.type='module';s.textContent='import "https://unpkg.com/@eyeglass/inspector"';document.head.appendChild(s);})();
```

## Usage

1. Navigate to any React/Vue/Svelte app in dev mode
2. Click the bookmarklet
3. Hover over elements and click to annotate
4. Your AI agent can call `get_focused_element()` to get the context
