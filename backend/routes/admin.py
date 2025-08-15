from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.models import StatsResponse, AdminLog
from services.database_service import db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=StatsResponse)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = await db_service.get_stats()
        return stats
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/logs", response_model=List[AdminLog])
async def get_admin_logs(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    """Get admin activity logs"""
    try:
        logs = await db_service.get_admin_logs(limit=limit, offset=offset)
        return logs
    except Exception as e:
        logger.error(f"Error fetching admin logs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")