# Fix issues from user-provided bug descriptions: $ARGUMENTS

## Goal
Reproduce the problem and fix the bug

## Steps
User-provided bug description: $ARGUMENTS

1. Understand the bug description and analyze the root cause. Attempt to reproduce the issue.
2. Fix the error. Use MCP tools `context7` and `brave-search` to retrieve the latest library information and understand the error. These MCP tool searches should be performed by multiple sub-agents. Additionally, use native web search sub-agents for problem investigation.
3. If another error occurs, always repeat the debugging workflow from steps 1 and 2.
4. When the issue is resolved, output the bug's root cause and the solution method used.
