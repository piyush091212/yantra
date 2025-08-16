#!/usr/bin/env python3
"""
Verify database has been populated with sample data and relationships work
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

def verify_sample_data():
    """Verify the database has the expected sample data"""
    print("🧪 Verifying Sample Data Population...")
    
    # Get stats
    response = requests.get(f"{API_BASE}/admin/stats")
    if response.status_code != 200:
        print(f"❌ Failed to get stats: {response.status_code}")
        return False
    
    stats = response.json()
    print(f"📊 Current Database Stats:")
    print(f"   - Artists: {stats['total_artists']}")
    print(f"   - Songs: {stats['total_songs']}")
    print(f"   - Albums: {stats['total_albums']}")
    print(f"   - Playlists: {stats['total_playlists']}")
    
    # Check if we have reasonable amounts of data (allowing for test data created)
    if (stats['total_artists'] >= 5 and 
        stats['total_songs'] >= 8 and 
        stats['total_albums'] >= 4 and 
        stats['total_playlists'] >= 5):
        print("✅ Database has sufficient sample data")
        return True
    else:
        print("❌ Database doesn't have expected sample data amounts")
        return False

def verify_relationships():
    """Verify that foreign key relationships are working"""
    print("\n🧪 Verifying Foreign Key Relationships...")
    
    # Get songs and check they have artist/album relationships
    response = requests.get(f"{API_BASE}/songs/?limit=5")
    if response.status_code != 200:
        print(f"❌ Failed to get songs: {response.status_code}")
        return False
    
    songs = response.json()
    if not songs:
        print("❌ No songs found")
        return False
    
    relationships_working = True
    
    for song in songs[:3]:  # Check first 3 songs
        print(f"🎵 Checking song: {song['title']}")
        
        # Check if song has artist_id
        if not song.get('artist_id'):
            print(f"   ❌ Song missing artist_id")
            relationships_working = False
            continue
        
        # Verify artist exists
        response = requests.get(f"{API_BASE}/artists/{song['artist_id']}")
        if response.status_code == 200:
            artist = response.json()
            print(f"   ✅ Linked to artist: {artist['name']}")
        else:
            print(f"   ❌ Artist not found for artist_id: {song['artist_id']}")
            relationships_working = False
        
        # Check album relationship if exists
        if song.get('album_id'):
            response = requests.get(f"{API_BASE}/albums/{song['album_id']}")
            if response.status_code == 200:
                album = response.json()
                print(f"   ✅ Linked to album: {album['title']}")
            else:
                print(f"   ❌ Album not found for album_id: {song['album_id']}")
                relationships_working = False
        else:
            print(f"   ℹ️  No album linked (optional)")
    
    return relationships_working

def verify_playlist_songs():
    """Verify playlist-song relationships"""
    print("\n🧪 Verifying Playlist-Song Relationships...")
    
    # Get playlists
    response = requests.get(f"{API_BASE}/playlists/?limit=3")
    if response.status_code != 200:
        print(f"❌ Failed to get playlists: {response.status_code}")
        return False
    
    playlists = response.json()
    if not playlists:
        print("❌ No playlists found")
        return False
    
    # Check if playlists have songs
    for playlist in playlists[:2]:  # Check first 2 playlists
        print(f"📋 Checking playlist: {playlist['name']}")
        
        response = requests.get(f"{API_BASE}/playlists/{playlist['id']}")
        if response.status_code == 200:
            detailed_playlist = response.json()
            songs = detailed_playlist.get('songs', [])
            print(f"   ✅ Contains {len(songs)} songs")
            
            # Check first song if exists
            if songs:
                first_song = songs[0]
                print(f"   🎵 First song: {first_song.get('title', 'Unknown')}")
        else:
            print(f"   ❌ Failed to get playlist details")
            return False
    
    return True

def test_search_with_relationships():
    """Test search functionality returns proper relationships"""
    print("\n🧪 Testing Search with Relationships...")
    
    # Search for a common term
    response = requests.get(f"{API_BASE}/songs/search?q=a&limit=5")
    if response.status_code != 200:
        print(f"❌ Search failed: {response.status_code}")
        return False
    
    results = response.json()
    
    # Check if search returns structured results
    expected_keys = ['songs', 'artists', 'albums', 'playlists']
    if all(key in results for key in expected_keys):
        print("✅ Search returns structured results with all entity types")
        
        # Check if songs in search results have artist info
        songs = results.get('songs', [])
        if songs:
            first_song = songs[0]
            if 'artist_name' in first_song or 'artist_id' in first_song:
                print("✅ Search results include artist relationship data")
                return True
            else:
                print("❌ Search results missing artist relationship data")
                return False
        else:
            print("ℹ️  No songs in search results (acceptable)")
            return True
    else:
        print(f"❌ Search results missing expected keys: {list(results.keys())}")
        return False

def main():
    """Run all data verification tests"""
    print("🎯 Running Database Sample Data Verification")
    print("=" * 60)
    
    tests = [
        ("Sample Data Population", verify_sample_data),
        ("Foreign Key Relationships", verify_relationships),
        ("Playlist-Song Relationships", verify_playlist_songs),
        ("Search with Relationships", test_search_with_relationships)
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
    print(f"📊 DATA VERIFICATION SUMMARY")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    if failed == 0:
        print("🎉 All data verification tests passed!")
        print("✅ Database properly populated with sample data")
        print("✅ Foreign key relationships working correctly")
        print("✅ Data retrieval with proper joins/relations working")
        return True
    else:
        print("⚠️  Some data verification issues found!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)