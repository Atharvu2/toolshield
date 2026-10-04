from pathlib import Path
from typing import List, Dict, Any, Tuple
import yaml
import json

from ..agents.schema import parse_agents_file, AgentDef
from ..tokens.github import can_trigger

def find_workflows(repo_path: Path) -> List[Path]:
    return list(repo_path.glob(".github/workflows/*.yml")) + list(repo_path.glob(".github/workflows/*.yaml"))

def parse_workflow(path: Path) -> Dict[str, Any]:
    with open(path, "r") as f:
        data = yaml.safe_load(f)
    return data if data else {}

def is_privileged_job(job: Dict[str, Any]) -> Tuple[bool, List[str]]:
    privileges = []
    
    # 1. Check permissions
    permissions = job.get("permissions", {})
    if isinstance(permissions, dict):
        if permissions.get("contents") == "write":
            privileges.append("contents:write")
        if permissions.get("id-token") == "write":
            privileges.append("id-token:write")
        if permissions.get("deployments") == "write":
            privileges.append("deployments:write")
        if permissions.get("packages") == "write":
            privileges.append("packages:write")
        
    # 2. Check steps for secrets or untrusted checkouts
    steps = job.get("steps", [])
    for step in steps:
        step_str = json.dumps(step)
        if "secrets." in step_str:
            privileges.append("secrets.*")
        if "actions/checkout" in step_str and "github.event.pull_request.head.sha" in step_str:
            privileges.append("actions/checkout:untrusted-ref")
            
    # 3. Job-level secrets?
    job_str = json.dumps(job)
    if "secrets." in job_str and "secrets.*" not in privileges:
        privileges.append("secrets.*")
        
    return len(privileges) > 0, privileges

def matches_trigger(producer_event: str, workflow: Dict[str, Any]) -> bool:
    on_clause = workflow.get("on")
    if on_clause is None:
        on_clause = workflow.get(True, {})
        
    if isinstance(on_clause, str):
        return producer_event == on_clause
        
    if isinstance(on_clause, list):
        return producer_event in on_clause
        
    if isinstance(on_clause, dict):
        if producer_event == "issue_comment" and "issue_comment" in on_clause:
            return True
        if producer_event == "issue_label" and ("issues" in on_clause or "pull_request_target" in on_clause):
            # very simplified matching for labels
            return True
        if producer_event == "repository_dispatch" and "repository_dispatch" in on_clause:
            return True
            
    return False

def scan_repo(repo_path: Path):
    agents_path = repo_path / ".traceshield" / "agents.yml"
    if not agents_path.exists():
        return []

    agents_file = parse_agents_file(agents_path)
    workflows = find_workflows(repo_path)
    
    findings = []
    
    for agent in agents_file.agents:
        token_type = agent.credential.type
        
        for producer_event in agent.produces:
            if not can_trigger(token_type, producer_event):
                continue
                
            for wf_path in workflows:
                wf_data = parse_workflow(wf_path)
                if not wf_data:
                    continue
                    
                if matches_trigger(producer_event, wf_data):
                    # Check jobs
                    jobs = wf_data.get("jobs", {})
                    for job_id, job in jobs.items():
                        is_priv, privs = is_privileged_job(job)
                        if is_priv:
                            findings.append({
                                "rule": "TSE-001",
                                "severity": "CRITICAL",
                                "decision": "BLOCK",
                                "evidence": {
                                    "input": agent.consumes[0] if agent.consumes else "unknown",
                                    "agent": agent.id,
                                    "identity": agent.identity,
                                    "credential": token_type,
                                    "artifact": producer_event,
                                    "trigger": producer_event, # simplified
                                    "workflow": str(wf_path.relative_to(repo_path)),
                                    "job": job_id,
                                    "privileges": privs
                                }
                            })
                            
    return findings
