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
        
        # Try to list existing buckets
        try:
            buckets = supabase.storage.list_buckets()
            print(f"📋 Existing buckets: {[bucket.name for bucket in buckets]}")
        except Exception as e:
            print(f"❌ Error listing buckets: {e}")
        
        # Test if music-file bucket exists
        try:
            files = supabase.storage.from_("music-file").list()
            print("✅ 'music-file' bucket exists and is accessible")
        except Exception as e:
            print(f"❌ 'music-file' bucket not accessible: {e}")
            # Try to create the bucket with correct syntax
            try:
                result = supabase.storage.create_bucket("music-file")
                print("✅ Created 'music-file' bucket")
            except Exception as create_error:
                print(f"❌ Failed to create 'music-file' bucket: {create_error}")
        
        # Test if cover-image bucket exists
        try:
            files = supabase.storage.from_("cover-image").list()
            print("✅ 'cover-image' bucket exists and is accessible")
        except Exception as e:
            print(f"❌ 'cover-image' bucket not accessible: {e}")
            # Try to create the bucket with correct syntax
            try:
                result = supabase.storage.create_bucket("cover-image")
                print("✅ Created 'cover-image' bucket")
            except Exception as create_error:
                print(f"❌ Failed to create 'cover-image' bucket: {create_error}")
        
        print("🎉 Supabase storage buckets check complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up storage buckets: {e}")
        return False

if __name__ == "__main__":
    setup_storage_buckets()