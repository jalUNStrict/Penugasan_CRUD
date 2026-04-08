from fastapi import FastAPI

from src.routes.event import router as event_router
from src.routes.role import router as role_router

app = FastAPI()
app.include_router(event_router)
app.include_router(role_router)

