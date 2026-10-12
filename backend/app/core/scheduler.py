from apscheduler.schedulers.asyncio import AsyncIOScheduler
from ..services.automation_engine import AutomationEngine

scheduler = AsyncIOScheduler()

def start_scheduler():
    try:
        # Schedule recurring automation check every 30 minutes
        scheduler.add_job(
            AutomationEngine.run_all_enabled_automations,
            'interval',
            minutes=30,
            id='automation_watcher_job',
            replace_existing=True
        )
        scheduler.start()
        print("Async Automation Scheduler started successfully.")
    except Exception as e:
        print(f"Failed to start scheduler: {e}")

def stop_scheduler():
    try:
        if scheduler.running:
            scheduler.shutdown()
            print("Async Automation Scheduler stopped.")
    except Exception as e:
        print(f"Error stopping scheduler: {e}")
