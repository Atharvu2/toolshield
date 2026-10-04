# ToolShield

ToolShield is a static analysis engine designed to detect agent-mediated authority escalation paths in GitHub Actions workflows (Rule: **TSE-001**).

## Overview

Modern repositories increasingly rely on AI agents to perform triage, labelling, and commentary. ToolShield addresses a critical supply chain risk: untrusted, attacker-controlled inputs (such as issue bodies or PR comments) can be processed by these agents to generate artifacts under a trusted identity. When these artifacts trigger downstream privileged workflows, they inadvertently form a cross-workflow authority escalation path.

ToolShield parses GitHub Actions YAML and agent declarations, building a deterministic cross-workflow authority graph. It strictly evaluates whether an agent-produced artifact possesses the necessary downstream trigger matches and identity semantics to reach a privileged sink.

## Features

- **TSE-001 Detection:** Statically identifies paths where untrusted inputs flow through an agent to trigger privileged jobs (e.g., jobs with `contents: write` or `secrets.*` access).
- **Deterministic Evaluation:** Uses an explainable graph model instead of heuristic-based assumptions.
- **Identity Semantics:** Properly differentiates between the artifact's author identity (trusted bot) and the artifact's content provenance (untrusted derived).
- **Token Awareness:** Implements correct triggering semantics for `github_token`, `github_app_installation_token`, and PATs based on event and activity types.

## Architecture

ToolShield consists of a Python-based analysis engine:

1. **Parser:** Extracts jobs, steps, permissions, and trigger conditions from `.github/workflows/*.yml`.
2. **Agent Schema Validation:** Processes hand-declared agent definitions from `.traceshield/agents.yml`.
3. **Graph Builder:** Constructs a direct graph modeling events, artifacts, triggers, and workflows.
4. **Policy Engine:** Evaluates the graph against the TSE-001 rule conditions.

## Usage

ToolShield provides a CLI for local analysis:

```bash
python -m backend.toolshield.cli.main <repository_path>
```

### Exit Codes

- `0`: ALLOW - No agent-mediated escalation paths found.
- `1`: BLOCK - TSE-001 violation detected.

## Requirements

- Python 3.12+
- Dependencies: `pydantic`, `pyyaml`, `typer`, `rich`, `fastapi`, `uvicorn`

## Documentation

- **Graph Model:** Nodes (Actor, Event, Agent, Artifact, Workflow, Job, Sink) and Edges (Consumes, Produces, Triggers, Executes).
- **Limitations:** Only supports explicit agent definitions (via `agents.yml`). Does not yet handle fully dynamic expression resolution for all GitHub Actions contexts.




