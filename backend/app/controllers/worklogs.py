from fastapi import APIRouter, HTTPException

from app.services.google_sheets import GoogleSheetsError
from app.services.worklog_service import WorklogServiceFactory

router = APIRouter(tags=["worklogs"])


@router.get("/worklogs")
async def get_worklogs():
    service = WorklogServiceFactory.create()
    try:
        return {"data": service.get_worklogs()}
    except GoogleSheetsError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unexpected error.") from exc
