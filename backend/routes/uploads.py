from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
from services.storage_service import storage_service
from models.models import UploadResponse

router = APIRouter(prefix="/uploads", tags=["uploads"])

@router.post("/audio", response_model=UploadResponse)
async def upload_audio_file(file: UploadFile = File(...)):
    """Upload an audio file to Supabase storage"""
    try:
        file_url = await storage_service.upload_audio_file(file)
        
        return UploadResponse(
            filename=file.filename,
            url=file_url,
            message="Audio file uploaded successfully"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image", response_model=UploadResponse)
async def upload_cover_image(file: UploadFile = File(...)):
    """Upload a cover image to Supabase storage"""
    try:
        file_url = await storage_service.upload_cover_image(file)
        
        return UploadResponse(
            filename=file.filename,
            url=file_url,
            message="Cover image uploaded successfully"
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multiple-images", response_model=List[UploadResponse])
async def upload_multiple_images(files: List[UploadFile] = File(...)):
    """Upload multiple cover images to Supabase storage"""
    results = []
    
    for file in files:
        try:
            file_url = await storage_service.upload_cover_image(file)
            results.append(UploadResponse(
                filename=file.filename,
                url=file_url,
                message="Cover image uploaded successfully"
            ))
        except Exception as e:
            results.append(UploadResponse(
                filename=file.filename,
                url="",
                message=f"Upload failed: {str(e)}"
            ))
    
    return results