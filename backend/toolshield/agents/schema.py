from pydantic import BaseModel, Field
from typing import List, Optional
import yaml
from pathlib import Path

class Credential(BaseModel):
    type: str
    source: str

class AgentDef(BaseModel):
    id: str
    workflow: str
    job: str
    step: str
    identity: str
    credential: Credential
    consumes: List[str]
    produces: List[str]

class AgentsFile(BaseModel):
    agents: List[AgentDef]

def parse_agents_file(path: Path) -> AgentsFile:
    with open(path, "r") as f:
        data = yaml.safe_load(f)
    if not data:
        data = {"agents": []}
    return AgentsFile(**data)
