import os
import uuid
from typing import Optional
from supabase import create_client, Client
from fastapi import UploadFile, HTTPException

class StorageService:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise Exception("Supabase configuration missing")
            
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def upload_audio_file(self, file: UploadFile) -> str:
        """Upload an audio file to Supabase storage"""
        if not file.content_type or not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'mp3'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        try:
            # Read file contents
            file_contents = await file.read()
            
            # Upload to Supabase storage
            result = self.supabase.storage.from_("music-files").upload(
                unique_filename, 
                file_contents,
                {
                    "content-type": file.content_type,
                    "x-upsert": "true"
                }
            )
            
            if result.error:
                raise HTTPException(status_code=500, detail=f"Upload failed: {result.error}")
            
            # Get public URL
            public_url = self.supabase.storage.from_("music-files").get_public_url(unique_filename)
            
            return public_url
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
    async def upload_cover_image(self, file: UploadFile) -> str:
        """Upload a cover image to Supabase storage"""
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image file")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        try:
            # Read file contents
            file_contents = await file.read()
            
            # Upload to Supabase storage
            result = self.supabase.storage.from_("cover-image").upload(
                unique_filename, 
                file_contents,
                {
                    "content-type": file.content_type,
                    "x-upsert": "true"
                }
            )
            
            if result.error:
                raise HTTPException(status_code=500, detail=f"Upload failed: {result.error}")
            
            # Get public URL
            public_url = self.supabase.storage.from_("cover-image").get_public_url(unique_filename)
            
            return public_url
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
    async def delete_file(self, bucket_name: str, file_path: str) -> bool:
        """Delete a file from Supabase storage"""
        try:
            result = self.supabase.storage.from_(bucket_name).remove([file_path])
            return not result.error
        except Exception as e:
            return False

# Create singleton instance
storage_service = StorageService()