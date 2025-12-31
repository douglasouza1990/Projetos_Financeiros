from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.worklogs import router as worklogs_router

app = FastAPI(title="Worklog Sheets API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(worklogs_router)
