from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.auth import router as auth_router
from app.donations import router as donations_router
from app.ngos import router as ngos_router
from app.leaderboard import router as leaderboard_router
from app.admin import router as admin_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="""
    ## Food Donation Platform API
    
    This API powers the Food Donation Platform, connecting food donors with NGOs 
    to reduce food waste and help those in need.
    
    ### Features
    - **Authentication**: Register, login, and manage user profiles
    - **Donations**: Create, view, and manage food donations
    - **NGO Management**: Admin functions for managing partner NGOs
    - **Leaderboard**:  Gamification with points and rankings
    - **Admin Dashboard**: Platform statistics and activity monitoring
    
    ### User Roles
    - **Donor**: Create donations, earn points, view leaderboard
    - **Staff**: Accept/complete/decline donations, view map
    - **Admin**: Manage NGOs, view platform stats
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix="/api")
app.include_router(donations_router.router, prefix="/api")
app.include_router(ngos_router.router, prefix="/api")
app.include_router(leaderboard_router.router, prefix="/api")
app.include_router(admin_router.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Food Donation Platform API",
        "docs":  "/docs",
        "health": "ok"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}