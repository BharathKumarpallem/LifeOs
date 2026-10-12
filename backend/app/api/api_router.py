from fastapi import APIRouter
from .endpoints.auth import router as auth_router
from .endpoints.life_management import router as life_management_router
from .endpoints.growth import router as growth_router
from .endpoints.intelligence import router as intelligence_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(life_management_router)
api_router.include_router(growth_router)
api_router.include_router(intelligence_router)
