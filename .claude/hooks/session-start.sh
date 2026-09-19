#!/bin/bash
# SessionStart hook: install dependencies so the Vite build and Playwright tests
# work during Claude Code on the web sessions.
#
# Runs synchronously so dependencies are ready before the agent loop starts.
# The container state is cached after this hook completes, so later sessions
# start fast.
set -euo pipefail

# Only run in the remote (Claude Code on the web) environment. Local users
# manage their own dependencies.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# npm project (package-lock.json). npm ci is exact and idempotent.
npm ci --no-fund --no-audit
