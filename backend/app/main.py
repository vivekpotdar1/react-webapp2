"""FastAPI application entry point.

This file creates the FastAPI app, enables CORS (so the React UI can call it),
and mounts the API routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router

app = FastAPI(title="IAM Portal Backend")

# Allow the Vite dev server (frontend) to call the backend during development.
# Without this, the browser blocks requests due to CORS rules.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the REST endpoints under /api
app.include_router(api_router)


@app.get("/health")
def health():
    # Small endpoint to confirm the server is running.
    return {"status": "ok"}
