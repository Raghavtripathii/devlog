
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, sessions, goals, profile

app = FastAPI(
    title="DevLog API",
    description="Track your coding sessions, set goals, get AI weekly recaps.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://devlog-lime.vercel.app",
 ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(goals.router)
app.include_router(profile.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "devlog-api"}


@app.get("/", tags=["health"])
def root():
    return {"message": "DevLog API. Visit /docs for the full API reference."}