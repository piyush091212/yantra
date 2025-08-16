import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def setup_storage_buckets():
    """Setup Supabase storage buckets for the application"""
    try:
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            print("Error: Supabase configuration missing")
            return False
        
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Create music-file bucket
        try:
            result = supabase.storage.create_bucket("music-file", {
                "public": True,
                "file_size_limit": 100 * 1024 * 1024,  # 100MB limit
                "allowed_mime_types": [
                    "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", 
                    "audio/aac", "audio/m4a", "audio/flac"
                ]
            })
            print("✅ Created 'music-file' bucket successfully")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("✅ 'music-file' bucket already exists")
            else:
                print(f"❌ Error creating 'music-file' bucket: {e}")
        
        # Create cover-image bucket  
        try:
            result = supabase.storage.create_bucket("cover-image", {
                "public": True,
                "file_size_limit": 10 * 1024 * 1024,  # 10MB limit
                "allowed_mime_types": [
                    "image/jpeg", "image/jpg", "image/png", "image/webp", 
                    "image/gif", "image/svg+xml"
                ]
            })
            print("✅ Created 'cover-image' bucket successfully")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("✅ 'cover-image' bucket already exists")
            else:
                print(f"❌ Error creating 'cover-image' bucket: {e}")
        
        print("🎉 Supabase storage buckets setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up storage buckets: {e}")
        return False

if __name__ == "__main__":
    setup_storage_buckets()