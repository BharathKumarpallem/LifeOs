import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from ...models.schemas import (
    Goal, GoalCreate, Habit, HabitCreate,
    LearningItem, LearningCreate, CareerApplication, CareerCreate,
    FamilyGroup, FamilyInviteCreate, ShoppingItemCreate,
    SharedShoppingItem, FamilyMember
)
from ...services.data_store import store

router = APIRouter(tags=["Personal Growth & Family"])

# ==================== 1. GOALS & HABITS ====================
@router.get("/goals", response_model=List[Goal])
def get_goals():
    return store.goals

@router.post("/goals", response_model=Goal)
def create_goal(data: GoalCreate):
    new_goal = Goal(
        id=f"gol-{uuid.uuid4().hex[:6]}",
        startDate=data.startDate or datetime.now().strftime("%Y-%m-%d"),
        **data.model_dump(exclude={"startDate"})
    )
    store.goals.append(new_goal)
    store.save_to_disk()
    return new_goal

@router.delete("/goals/{goal_id}")
def delete_goal(goal_id: str):
    idx = next((i for i, g in enumerate(store.goals) if g.id == goal_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    store.goals.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": goal_id}

@router.post("/goals/{goal_id}/milestones/{milestone_id}/toggle", response_model=Goal)
def toggle_goal_milestone(goal_id: str, milestone_id: str):
    goal = next((g for g in store.goals if g.id == goal_id), None)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    ms = next((m for m in goal.milestones if m.id == milestone_id), None)
    if not ms:
        raise HTTPException(status_code=404, detail="Milestone not found")
    ms.completed = not ms.completed
    # Recalculate progress percent
    if goal.milestones:
        completed_count = sum(1 for m in goal.milestones if m.completed)
        goal.progressPercent = int((completed_count / len(goal.milestones)) * 100)
    store.save_to_disk()
    return goal

@router.get("/habits", response_model=List[Habit])
def get_habits():
    return store.habits

@router.post("/habits", response_model=Habit)
def create_habit(data: HabitCreate):
    new_habit = Habit(
        id=f"hab-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.habits.append(new_habit)
    store.save_to_disk()
    return new_habit

@router.post("/habits/{habit_id}/checkin", response_model=Habit)
def toggle_habit_checkin(habit_id: str):
    habit = next((h for h in store.habits if h.id == habit_id), None)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    today_str = datetime.now().strftime("%Y-%m-%d")
    if today_str in habit.checkins:
        habit.checkins.remove(today_str)
        habit.currentStreak = max(0, habit.currentStreak - 1)
    else:
        habit.checkins.append(today_str)
        habit.currentStreak += 1
        if habit.currentStreak > habit.bestStreak:
            habit.bestStreak = habit.currentStreak
    store.save_to_disk()
    return habit

@router.delete("/habits/{habit_id}")
def delete_habit(habit_id: str):
    idx = next((i for i, h in enumerate(store.habits) if h.id == habit_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    store.habits.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": habit_id}

# ==================== 2. LEARNING ====================
@router.get("/learning", response_model=List[LearningItem])
def get_learning():
    return store.learning

@router.post("/learning", response_model=LearningItem)
def create_learning(data: LearningCreate):
    new_lrn = LearningItem(
        id=f"lrn-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.learning.append(new_lrn)
    store.save_to_disk()
    return new_lrn

@router.delete("/learning/{learning_id}")
def delete_learning(learning_id: str):
    idx = next((i for i, l in enumerate(store.learning) if l.id == learning_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Learning subject not found")
    store.learning.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": learning_id}

@router.post("/learning/{learning_id}/study-plan/{plan_id}/toggle", response_model=LearningItem)
def toggle_study_plan_item(learning_id: str, plan_id: str):
    item = next((l for l in store.learning if l.id == learning_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Subject not found")
    sp = next((s for s in item.studyPlan if s.id == plan_id), None)
    if not sp:
        raise HTTPException(status_code=404, detail="Study plan item not found")
    sp.completed = not sp.completed
    if item.studyPlan:
        completed_count = sum(1 for s in item.studyPlan if s.completed)
        item.progressPercent = int((completed_count / len(item.studyPlan)) * 100)
    store.save_to_disk()
    return item

# ==================== 3. CAREER ====================
@router.get("/career", response_model=List[CareerApplication])
def get_career():
    return store.career

@router.post("/career", response_model=CareerApplication)
def create_career_application(data: CareerCreate):
    new_app = CareerApplication(
        id=f"car-{uuid.uuid4().hex[:6]}",
        applicationDate=data.applicationDate or datetime.now().strftime("%Y-%m-%d"),
        **data.model_dump(exclude={"applicationDate"})
    )
    store.career.insert(0, new_app)
    store.save_to_disk()
    return new_app

@router.put("/career/{app_id}", response_model=CareerApplication)
def update_career_application(app_id: str, status: Optional[str] = None, notes: Optional[str] = None):
    app = next((c for c in store.career if c.id == app_id), None)
    if not app:
        raise HTTPException(status_code=404, detail="Career application not found")
    if status:
        app.status = status
    if notes:
        app.notes = notes
    store.save_to_disk()
    return app

@router.delete("/career/{app_id}")
def delete_career_application(app_id: str):
    idx = next((i for i, c in enumerate(store.career) if c.id == app_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Career application not found")
    store.career.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": app_id}

# ==================== 4. FAMILY ====================
@router.get("/family", response_model=FamilyGroup)
def get_family_group():
    return store.family

@router.post("/family/members", response_model=FamilyMember)
def invite_family_member(data: FamilyInviteCreate):
    new_mem = FamilyMember(
        id=f"mem-{uuid.uuid4().hex[:6]}",
        **data.model_dump()
    )
    store.family.members.append(new_mem)
    store.save_to_disk()
    return new_mem

@router.post("/family/shopping", response_model=SharedShoppingItem)
def add_shopping_item(data: ShoppingItemCreate):
    new_item = SharedShoppingItem(
        id=f"shop-{uuid.uuid4().hex[:6]}",
        addedBy=store.user.name,
        **data.model_dump()
    )
    store.family.sharedShoppingList.append(new_item)
    store.save_to_disk()
    return new_item

@router.post("/family/shopping/{item_id}/toggle", response_model=SharedShoppingItem)
def toggle_shopping_item(item_id: str):
    item = next((s for s in store.family.sharedShoppingList if s.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Shopping item not found")
    item.completed = not item.completed
    store.save_to_disk()
    return item

@router.delete("/family/shopping/{item_id}")
def delete_shopping_item(item_id: str):
    idx = next((i for i, s in enumerate(store.family.sharedShoppingList) if s.id == item_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Shopping item not found")
    store.family.sharedShoppingList.pop(idx)
    store.save_to_disk()
    return {"status": "SUCCESS", "deletedId": item_id}
