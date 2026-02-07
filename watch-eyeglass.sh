#!/bin/bash
# Eyeglass Watcher - watches for new requests and notifies Claude
# Usage: ./watch-eyeglass.sh (run in a separate terminal)

CONTEXT_FILE=".eyeglass_context.md"

echo "👓 Eyeglass watcher started. Watching for new requests..."

# Use fswatch on macOS, inotifywait on Linux
if command -v fswatch &> /dev/null; then
  fswatch -o "$CONTEXT_FILE" | while read; do
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔔 New Eyeglass request detected!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    head -10 "$CONTEXT_FILE"
    echo "..."
    echo ""
    echo "💡 Prompt Claude: 'check eyeglass'"
  done
elif command -v inotifywait &> /dev/null; then
  while inotifywait -q -e modify "$CONTEXT_FILE"; do
    echo ""
    echo "🔔 New Eyeglass request! Prompt Claude: 'check eyeglass'"
  done
else
  echo "Please install fswatch (macOS) or inotify-tools (Linux)"
  exit 1
fi
