from fastapi import FastAPI
from pydantic import BaseModel
import yaml, requests, os

app = FastAPI(title="C6 Orchestration Bridge")
OLLAMA = os.getenv("OLLAMA_HOST", "http://ollama:11434")

with open("agents.yaml") as f:
    AGENTS = yaml.safe_load(f)["agents"]

class Task(BaseModel):
    agent: str
    input: str
    context: str = ""

@app.get("/")
def health():
    return {"status": "ok", "agents": list(AGENTS.keys())}

@app.post("/run")
def run(task: Task):
    if task.agent not in AGENTS:
        return {"error": f"Unknown agent: {task.agent}", "available": list(AGENTS.keys())}
    cfg = AGENTS[task.agent]
    full_prompt = f"{cfg["prompt"]}\n\n{task.context}\n\nInput: {task.input}"
    r = requests.post(
        f"{OLLAMA}/api/generate",
        json={"model": cfg["model"], "prompt": full_prompt, "stream": False, "options": {"temperature": cfg.get("temperature", 0.5)}},
        timeout=120
    )
    return {"agent": task.agent, "response": r.json().get("response", "")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7000)
