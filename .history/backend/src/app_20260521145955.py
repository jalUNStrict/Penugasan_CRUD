from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.event import router as event_router
from src.routes.role import router as role_router
from src.routes.user import router as user_router
from src.routes.account import router as account_router 
from src.routes.registration import router as registration_router
from src.controllers.auth import router as auth_router 
from src.utils.seed import seed_database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    seed_database()

app.include_router(auth_router)

app.include_router(event_router)
app.include_router(role_router)
app.include_router(user_router)
app.include_router(account_router)
app.include_router(registration_router)

@app.get("/")
def root():
    return {"message": "Backend API is running with Auth"}