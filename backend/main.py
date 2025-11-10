from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bayesian_model import BayesianBeliefModel

app = FastAPI(title="Dharma Visualizer API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model = BayesianBeliefModel()

# Request/Response models
class AddExperienceRequest(BaseModel):
    value: float
    sigma: float = 1.0  # Emotional charge: low sigma = high charge

class MeditateRequest(BaseModel):
    meditation_level: float  # 0.0 to 1.0

class BrahmaViharasRequest(BaseModel):
    level: float  # 0.0 to 1.0

@app.get("/")
def read_root():
    return {"message": "Dharma Visualizer API"}

@app.post("/experience")
def add_experience(request: AddExperienceRequest):
    """Add a new experience to the model"""
    model.add_experience(request.value, request.sigma)
    return {"status": "success", "message": "Experience added"}

@app.post("/meditate")
def meditate(request: MeditateRequest):
    """Meditate on the latest experience to release rigidity"""
    try:
        model.meditate_on_latest(request.meditation_level)
        return {"status": "success", "message": f"Meditated at level {request.meditation_level:.0%}"}
    except ValueError as e:
        return {"status": "error", "message": str(e)}

@app.post("/brahma_viharas")
def set_brahma_viharas(request: BrahmaViharasRequest):
    """Set the brahma viharas cultivation level for automatic charge release"""
    model.set_brahma_viharas_level(request.level)
    return {"status": "success", "message": f"Brahma viharas level set to {request.level:.0%}"}

@app.get("/state")
def get_state():
    """Get the complete current state of the model"""
    return model.get_state()

@app.post("/reset")
def reset_model():
    """Reset the model to initial state"""
    global model
    model = BayesianBeliefModel()
    return {"status": "success", "message": "Model reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
