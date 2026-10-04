from backend.toolshield.scanning.scanner import scan_repo, parse_agents_file, can_trigger, parse_workflow, matches_trigger, is_privileged_job
from pathlib import Path

p = Path("fixtures/A1-comment")
agents_path = p / ".traceshield" / "agents.yml"
agents = parse_agents_file(agents_path)
print("agents:", agents)

for agent in agents.agents:
    print("agent:", agent.id, "credential:", agent.credential.type, "produces:", agent.produces)
    for prod in agent.produces:
        print("can trigger?", can_trigger(agent.credential.type, prod))
        
        for w in list(p.glob('.github/workflows/*.yml')):
            wf = parse_workflow(w)
            print("wf:", w, "matches?", matches_trigger(prod, wf))
            if matches_trigger(prod, wf):
                for jid, job in wf.get("jobs", {}).items():
                    print("job:", jid, "is_priv?", is_privileged_job(job))

