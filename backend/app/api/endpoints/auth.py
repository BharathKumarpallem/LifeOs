from fastapi import APIRouter
from ...models.schemas import UserProfile, UserUpdate
from ...services.data_store import store

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

@router.get("/me", response_model=UserProfile)
def get_current_user():
    return store.user

@router.put("/profile", response_model=UserProfile)
def update_profile(updates: UserUpdate):
    for key, value in updates.model_dump(exclude_unset=True).items():
        if hasattr(store.user, key) and value is not None:
            setattr(store.user, key, value)
    store.save_to_disk()
    return store.user

@router.post("/reset-demo")
def reset_demo_data():
    store.reset_demo()
    return {"status": "SUCCESS", "message": "LifeOS demo state restored across all 15 modules."}
