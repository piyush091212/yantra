#!/usr/bin/env python3
"""
Specific test for DELETE and UPDATE operations to verify they actually work
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

def test_delete_operations():
    """Test that DELETE operations actually remove data from database"""
    print("🧪 Testing DELETE Operations...")
    
    # Create a test artist first
    artist_data = {
        "name": "Test Delete Artist",
        "bio": "Artist to be deleted",
        "avatar_url": "https://example.com/test.jpg"
    }
    
    # Create artist
    response = requests.post(f"{API_BASE}/artists/", json=artist_data)
    if response.status_code != 200:
        print(f"❌ Failed to create test artist: {response.status_code}")
        return False
    
    artist = response.json()
    artist_id = artist['id']
    print(f"✅ Created test artist: {artist['name']} (ID: {artist_id})")
    
    # Verify artist exists
    response = requests.get(f"{API_BASE}/artists/{artist_id}")
    if response.status_code != 200:
        print(f"❌ Artist not found after creation: {response.status_code}")
        return False
    print(f"✅ Verified artist exists before deletion")
    
    # Delete the artist
    response = requests.delete(f"{API_BASE}/artists/{artist_id}")
    if response.status_code != 200:
        print(f"❌ Failed to delete artist: {response.status_code}")
        return False
    print(f"✅ Delete request successful")
    
    # Verify artist is actually deleted
    response = requests.get(f"{API_BASE}/artists/{artist_id}")
    if response.status_code == 404:
        print(f"✅ VERIFIED: Artist actually deleted from database (404 response)")
        return True
    else:
        print(f"❌ CRITICAL: Artist still exists after delete! Status: {response.status_code}")
        return False

def test_update_operations():
    """Test that UPDATE operations actually modify data in database"""
    print("\n🧪 Testing UPDATE Operations...")
    
    # Create a test song first
    # Get an existing artist for the song
    response = requests.get(f"{API_BASE}/artists/")
    if response.status_code != 200:
        print(f"❌ Failed to get artists: {response.status_code}")
        return False
    
    artists = response.json()
    if not artists:
        print(f"❌ No artists available for song creation")
        return False
    
    artist_id = artists[0]['id']
    
    song_data = {
        "title": "Original Song Title",
        "artist_id": artist_id,
        "duration": "3:30",
        "genre": "Original Genre",
        "audio_url": "https://example.com/original.mp3",
        "cover_url": "https://example.com/original.jpg"
    }
    
    # Create song
    response = requests.post(f"{API_BASE}/songs/", json=song_data)
    if response.status_code != 200:
        print(f"❌ Failed to create test song: {response.status_code}")
        return False
    
    song = response.json()
    song_id = song['id']
    print(f"✅ Created test song: {song['title']} (ID: {song_id})")
    
    # Update the song
    update_data = {
        "title": "Updated Song Title",
        "genre": "Updated Genre",
        "duration": "4:15"
    }
    
    response = requests.put(f"{API_BASE}/songs/{song_id}", json=update_data)
    if response.status_code != 200:
        print(f"❌ Failed to update song: {response.status_code}")
        return False
    print(f"✅ Update request successful")
    
    # Verify the song was actually updated
    response = requests.get(f"{API_BASE}/songs/{song_id}")
    if response.status_code != 200:
        print(f"❌ Failed to retrieve updated song: {response.status_code}")
        return False
    
    updated_song = response.json()
    
    # Check if the updates were applied
    if (updated_song['title'] == "Updated Song Title" and 
        updated_song['genre'] == "Updated Genre" and
        updated_song['duration'] == "4:15"):
        print(f"✅ VERIFIED: Song actually updated in database")
        print(f"   - Title: {updated_song['title']}")
        print(f"   - Genre: {updated_song['genre']}")
        print(f"   - Duration: {updated_song['duration']}")
        
        # Clean up - delete the test song
        requests.delete(f"{API_BASE}/songs/{song_id}")
        return True
    else:
        print(f"❌ CRITICAL: Song not properly updated!")
        print(f"   - Expected title: 'Updated Song Title', Got: '{updated_song['title']}'")
        print(f"   - Expected genre: 'Updated Genre', Got: '{updated_song['genre']}'")
        print(f"   - Expected duration: '4:15', Got: '{updated_song['duration']}'")
        return False

def test_data_consistency():
    """Test data consistency and real-time updates"""
    print("\n🧪 Testing Data Consistency...")
    
    # Get current counts
    response = requests.get(f"{API_BASE}/admin/stats")
    if response.status_code != 200:
        print(f"❌ Failed to get initial stats: {response.status_code}")
        return False
    
    initial_stats = response.json()
    initial_artists = initial_stats['total_artists']
    print(f"✅ Initial artist count: {initial_artists}")
    
    # Create a new artist
    artist_data = {
        "name": "Consistency Test Artist",
        "bio": "Testing data consistency",
        "avatar_url": "https://example.com/consistency.jpg"
    }
    
    response = requests.post(f"{API_BASE}/artists/", json=artist_data)
    if response.status_code != 200:
        print(f"❌ Failed to create artist: {response.status_code}")
        return False
    
    artist = response.json()
    artist_id = artist['id']
    print(f"✅ Created artist: {artist['name']}")
    
    # Check if stats updated immediately
    response = requests.get(f"{API_BASE}/admin/stats")
    if response.status_code != 200:
        print(f"❌ Failed to get updated stats: {response.status_code}")
        return False
    
    updated_stats = response.json()
    updated_artists = updated_stats['total_artists']
    
    if updated_artists == initial_artists + 1:
        print(f"✅ VERIFIED: Stats updated in real-time (count: {updated_artists})")
    else:
        print(f"❌ CRITICAL: Stats not updated! Expected: {initial_artists + 1}, Got: {updated_artists}")
        return False
    
    # Delete the artist and verify stats update again
    response = requests.delete(f"{API_BASE}/artists/{artist_id}")
    if response.status_code != 200:
        print(f"❌ Failed to delete artist: {response.status_code}")
        return False
    
    # Check if stats updated after deletion
    response = requests.get(f"{API_BASE}/admin/stats")
    if response.status_code != 200:
        print(f"❌ Failed to get final stats: {response.status_code}")
        return False
    
    final_stats = response.json()
    final_artists = final_stats['total_artists']
    
    if final_artists == initial_artists:
        print(f"✅ VERIFIED: Stats updated after deletion (count: {final_artists})")
        return True
    else:
        print(f"❌ CRITICAL: Stats not updated after deletion! Expected: {initial_artists}, Got: {final_artists}")
        return False

def main():
    """Run all critical tests"""
    print("🎯 Running Critical DELETE/UPDATE/CONSISTENCY Tests")
    print("=" * 60)
    
    tests = [
        ("DELETE Operations", test_delete_operations),
        ("UPDATE Operations", test_update_operations),
        ("Data Consistency", test_data_consistency)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name}: PASSED")
            else:
                failed += 1
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            failed += 1
            print(f"❌ {test_name}: ERROR - {str(e)}")
        print("-" * 40)
    
    print("=" * 60)
    print(f"📊 CRITICAL TESTS SUMMARY")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    if failed == 0:
        print("🎉 All critical operations working correctly!")
        print("✅ DELETE operations actually remove data from database")
        print("✅ UPDATE operations properly modify existing records")
        print("✅ Data consistency and real-time updates working")
        return True
    else:
        print("⚠️  Critical issues found!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)