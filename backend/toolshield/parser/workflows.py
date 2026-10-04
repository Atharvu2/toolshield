import yaml
from pathlib import Path
from typing import Dict, Any

def parse_workflow(path: Path) -> Dict[str, Any]:
    with open(path, "r") as f:
        data = yaml.safe_load(f)
    return data if data else {}
