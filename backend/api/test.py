from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create minimal FastAPI app
app = FastAPI(title="Todo API")

# Simple CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Todo API is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Vercel handler
handler = app
