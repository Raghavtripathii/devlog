# The entry point for the FastAPI application.
# This is where everything gets wired together.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DevLog API",
    description="Track your coding sessions, set goals, get AI weekly recaps.",
    version="1.0.0",
)

# CORS lets our React frontend (running on localhost:5173) talk to this API.
# Without this, the browser would block all requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    """Quick endpoint to check if the API is alive. Used by CI/CD."""
    return {"status": "ok", "service": "devlog-api"}


@app.get("/", tags=["health"])
def root():
    return {"message": "DevLog API. Visit /docs for the full API reference."}