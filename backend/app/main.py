from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.scheduler import start_scheduler, stop_scheduler
from .api.api_router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start background automation and reminder scheduler
    start_scheduler()
    yield
    # Shutdown: Stop scheduler cleanly
    stop_scheduler()

app = FastAPI(
    title="LifeOS Backend API",
    description="High-performance asynchronous FastAPI backend for LifeOS — Your Personal Life Operating System.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API endpoints under /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "ONLINE",
        "docsUrl": "/docs",
        "apiPrefix": settings.API_V1_PREFIX
    }

@app.get("/health", tags=["Root"])
def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION
    }
