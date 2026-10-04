import typer
from rich.console import Console
from rich.json import JSON
from pathlib import Path
import json
import sys

from ..scanning.scanner import scan_repo

app = typer.Typer()
console = Console()

@app.command()
def scan(path: Path):
    if not path.exists() or not path.is_dir():
        console.print(f"[red]Error: Path {path} does not exist or is not a directory.[/red]")
        sys.exit(1)
        
    findings = scan_repo(path)
    
    if not findings:
        console.print("[green]ALLOW[/green]: No TSE-001 findings.")
        sys.exit(0)
        
    console.print("[red]BLOCK[/red]: TSE-001 Agent-Mediated Authority Escalation found.")
    for f in findings:
        console.print(JSON(json.dumps(f)))
        
    sys.exit(1)

if __name__ == "__main__":
    app()
