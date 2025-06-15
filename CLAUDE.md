# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Directory Structure

This is a Claude Code configuration directory (`~/.claude`) containing:

- `settings.json` - Main Claude Code configuration file with permissions, environment variables, and preferences
- `settings.local.json` - Local overrides for Claude Code settings
- `projects/` - Session history files for different projects worked on with Claude Code
- `todos/` - Saved todo lists from various Claude Code sessions
- `statsig/` - Analytics and feature flag cache files

## Configuration Files

### settings.json Structure

The main configuration file supports the following options:

| Key | Description | Example |
|-----|-------------|---------|
| `model` | Preferred model (currently "opus") | `"opus"` |
| `theme` | Color theme setting | `"dark"` |
| `cleanupPeriodDays` | Days to retain chat history | `30` |
| `includeCoAuthoredBy` | Include Claude co-author in git commits | `false` |
| `permissions` | Permission rules with `allow` and `deny` lists | See below |
| `env` | Environment variables for all sessions | `{"FOO": "bar"}` |

### Permission System

The current configuration includes extensive permissions for development tools:

#### Allow Rules Examples:
- `Bash(npm:*)` - All npm commands
- `Bash(uv:*)` - UV Python package manager
- `Bash(deno:*)` - Deno runtime and tools
- `Bash(cargo:*)` - Rust Cargo package manager
- `Bash(git:*)` - All git commands
- `Read(**)` - Read any file
- `Edit(~/projects/**)` - Edit files in projects directory
- `WebFetch(domain:*)` - Fetch from any domain

#### Permission Rule Format:
- `Tool` - Allows any use of the tool
- `Tool(specifier)` - More specific permissions
- `Bash(command:*)` - Commands starting with "command"
- `Edit(path/pattern)` - File editing with gitignore-style patterns
- `Read(~/file)` - Specific file reading

#### Deny Rules:
Deny rules override allow rules. Current deny rules include:
- `Bash(rm -rf /)` - Prevent system deletion
- `Bash(sudo rm:*)` - Prevent sudo removal commands
- `Bash(curl * | sh)` - Prevent piped script execution
- `Bash(npm publish:*)` - Prevent accidental publishing
- `Bash(cargo publish:*)` - Prevent accidental Rust crate publishing
- `Bash(git push -f:*)` - Prevent force pushing to main
- `Edit(/etc/**)` - Prevent system file editing
- `Bash(DROP DATABASE*)` - Prevent database deletion
- `Bash(DROP TABLE*)` - Prevent table deletion
- `Bash(TRUNCATE*)` - Prevent data truncation
- `Bash(mongod --dbpath * --repair)` - Prevent MongoDB repair operations
- `Bash(redis-cli FLUSHALL)` - Prevent Redis data flush
- `Bash(redis-cli FLUSHDB)` - Prevent Redis database flush
- `Bash(psql*DROP*)` - Prevent PostgreSQL drop commands
- `Bash(mysql*DROP*)` - Prevent MySQL drop commands
- `Edit(*.sqlite)` - Prevent direct SQLite file editing
- `Edit(*.db)` - Prevent direct database file editing
- `Bash(supabase db reset*)` - Prevent Supabase database reset
- `Bash(supabase db wipe*)` - Prevent Supabase data wipe
- `Bash(firebase firestore:delete*)` - Prevent Firestore deletion
- `Bash(firebase database:remove*)` - Prevent Realtime Database deletion
- `Bash(firebase emulators:*--clear*)` - Prevent emulator data clearing
- `Bash(firebase projects:delete*)` - Prevent Firebase project deletion
- `Bash(aws rds delete*)` - Prevent AWS RDS deletion
- `Bash(aws dynamodb delete*)` - Prevent DynamoDB deletion
- `Bash(aws s3 rb*)` - Prevent S3 bucket removal
- `Bash(aws s3api delete-bucket*)` - Prevent S3 bucket deletion via API
- `Bash(aws cloudformation delete*)` - Prevent CloudFormation stack deletion
- `Bash(aws ec2 terminate*)` - Prevent EC2 instance termination
- `Bash(gcloud sql instances delete*)` - Prevent GCP Cloud SQL deletion
- `Bash(gcloud firestore databases delete*)` - Prevent GCP Firestore deletion
- `Bash(gcloud storage rm*)` - Prevent GCP Storage deletion
- `Bash(gcloud compute instances delete*)` - Prevent GCP instance deletion
- `Bash(bq rm*)` - Prevent BigQuery dataset/table deletion
- `Bash(az sql db delete*)` - Prevent Azure SQL deletion
- `Bash(az cosmosdb*delete*)` - Prevent Azure Cosmos DB deletion
- `Bash(az storage*delete*)` - Prevent Azure Storage deletion
- `Bash(az vm delete*)` - Prevent Azure VM deletion
- `Bash(vercel rm*)` - Prevent Vercel project removal
- `Bash(vercel remove*)` - Prevent Vercel deployment removal
- `Bash(netlify*delete*)` - Prevent Netlify site deletion
- `Bash(heroku apps:destroy*)` - Prevent Heroku app destruction
- `Bash(heroku pg:reset*)` - Prevent Heroku database reset
- `Bash(pscale database delete*)` - Prevent PlanetScale deletion
- `Bash(pscale branch delete*)` - Prevent PlanetScale branch deletion
- `Bash(neon*delete*)` - Prevent Neon database deletion
- `Bash(cqlsh*DROP*)` - Prevent Cassandra deletion
- `Bash(elasticsearch*DELETE*)` - Prevent Elasticsearch deletion
- `Bash(clickhouse-client*DROP*)` - Prevent ClickHouse deletion

### Settings Priority

Settings are applied in priority order:
1. Enterprise policies
2. Command line arguments
3. Local project settings
4. Shared project settings
5. User settings

## Environment Variables

Key environment variables configured:

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | Controls telemetry (currently "0") |
| `DISABLE_COST_WARNINGS` | Disable cost warning messages |
| `BASH_DEFAULT_TIMEOUT_MS` | Default timeout for bash commands (300000ms) |
| `BASH_MAX_TIMEOUT_MS` | Maximum timeout for bash commands (1200000ms) |
| `SHELL` | Preferred shell (/opt/homebrew/bin/fish) |
| `UV_CACHE_DIR` | UV package manager cache directory |
| `UV_PYTHON_PREFERENCE` | UV Python installation preference (managed) |
| `DENO_DIR` | Deno cache directory |
| `CARGO_HOME` | Rust Cargo home directory |
| `RUSTUP_HOME` | Rustup home directory |
| `GOPATH` | Go workspace directory |
| `NODE_OPTIONS` | Node.js memory settings |
| `SUPABASE_URL` | Supabase project URL (use development/staging URL) |
| `FIREBASE_PROJECT` | Firebase project ID (use development/staging project) |
| `AWS_PROFILE` | AWS profile (use development/staging profile) |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID (use development/staging project) |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription (use development/staging subscription) |

## Working with This Directory

When working in this Claude configuration directory:

1. **Reading Configuration**: Use Read tool to examine settings files
2. **Modifying Permissions**: Edit settings.json to adjust tool permissions
3. **Environment Variables**: Modify the `env` section for session variables
4. **Project History**: Session histories stored as JSONL files by project path
5. **Todo Management**: Historical todos preserved as JSON files

## Permission Management Commands

Use `/permissions` in Claude Code to:
- View current permission rules
- See which settings.json file provides each rule
- Manage allow/deny lists interactively

## Security Considerations

- Deny rules always override allow rules
- File editing permissions use gitignore-style patterns
- System directories are protected by default deny rules
- SSH keys and sensitive files are explicitly denied for editing
- Regular cleanup of session data (30 days by default)
- **Database protection is enforced even in dangerously mode** - destructive database operations remain blocked
- Production database files and connections should never be directly accessible
- **Major cloud providers are protected**: AWS, GCP, Azure, Supabase, Firebase, Vercel, Netlify, Heroku, PlanetScale, Neon
- **All popular databases are protected**: PostgreSQL, MySQL, MongoDB, Redis, Cassandra, Elasticsearch, ClickHouse, DynamoDB, Cosmos DB
- Production API keys and service accounts should use read-only permissions when possible

## Common Configuration Tasks

1. **Add new tool permission**: Add to `permissions.allow` array
2. **Block specific command**: Add to `permissions.deny` array
3. **Set environment variable**: Add to `env` object
4. **Change cleanup period**: Modify `cleanupPeriodDays` value
5. **Disable telemetry**: Set `CLAUDE_CODE_ENABLE_TELEMETRY` to "0"
6. **Protect new database/cloud service**: Add deletion commands to `permissions.deny` array

## Test-Driven Development (TDD) Workflow

TDD workflow for Claude Code:
1. **Write tests first** - Specify expected input/output, explicitly mention using TDD
2. **Verify tests fail** - Run tests without implementation code
3. **Commit tests** - Save test checkpoint
4. **Write implementation** - Code until all tests pass, don't modify tests
5. **Verify quality** - Ensure implementation isn't overfitting
6. **Commit code** - Save working implementation

Claude performs best with clear targets like tests to iterate against.

## Git Undo Strategy

Simple staging workflow for safe undo:
1. **Auto-stage after each change**: Run `git add <file>` after editing files
2. **User checks changes**: Review with `git status` and `git diff --staged`

This keeps working directory changes while allowing easy rollback without cluttering commit history.

## Critical Rules - DO NOT VIOLATE
- **NEVER create mock data or simplified components** unless explicitly told to do so
- **NEVER replace existing complex components with simplified versions** - always fix the actual problem
- **ALWAYS work with the existing codebase** - do not create new simplified alternatives
- **ALWAYS find and fix the root cause** of issues instead of creating workarounds
- **NEVER execute destructive database operations** - no DROP, TRUNCATE, or DELETE without explicit permission
- **NEVER modify production database directly** - always use migrations or safe methods
- **NEVER delete cloud resources** - no deletion of instances, buckets, databases, or projects on ANY cloud provider
- **ALWAYS use development/staging environments** - never work directly with production resources
- When debugging issues, focus on fixing the existing implementation, not replacing it
- When something doesn't work, debug and fix it - don't start over with a simple version
