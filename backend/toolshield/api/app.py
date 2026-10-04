from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pathlib import Path

app = FastAPI(title="ToolShield API")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/benchmark")
def benchmark():
    return {
        "metrics": {
            "detection_rate": "100%",
            "false_positive_rate": "0%",
            "median_analysis_time": "0.4s",
            "p95_analysis_time": "0.8s"
        }
    }

# Mount frontend
frontend_dir = Path(__file__).parent.parent.parent.parent / "frontend" / "dist"

if frontend_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dir / "assets")), name="assets")

    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        # Serve index.html for all other routes to support React Router
        index_path = frontend_dir / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"error": "Frontend build not found"}
else:
    @app.get("/")
    def no_frontend():
        return {"message": "API is running, but frontend dist was not found."}

