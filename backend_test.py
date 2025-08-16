#!/usr/bin/env python3
"""
YantraTune Backend API Test Suite
Tests all backend endpoints comprehensively
"""

import requests
import json
import uuid
from datetime import datetime, date
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class YantraTuneAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.test_results = []
        self.created_entities = {
            'artists': [],
            'albums': [],
            'songs': [],
            'playlists': []
        }
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        if response_data:
            result['response'] = response_data
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "YantraTune API" in data.get("message", ""):
                    self.log_test("Health Check", True, f"API is running: {data['message']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            return False

    def test_artists_crud(self):
        """Test Artists CRUD operations"""
        # Test GET all artists
        try:
            response = requests.get(f"{self.base_url}/artists")
            if response.status_code == 200:
                artists = response.json()
                self.log_test("GET /artists", True, f"Retrieved {len(artists)} artists")
            else:
                self.log_test("GET /artists", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /artists", False, f"Error: {str(e)}")
            return False

        # Test POST create artist
        artist_data = {
            "name": "Arijit Singh",
            "bio": "Popular Indian playback singer",
            "avatar_url": "https://example.com/arijit.jpg"
        }
        
        try:
            response = requests.post(f"{self.base_url}/artists", json=artist_data)
            if response.status_code == 200:
                artist = response.json()
                self.created_entities['artists'].append(artist['id'])
                self.log_test("POST /artists", True, f"Created artist: {artist['name']}")
                
                # Test GET specific artist
                response = requests.get(f"{self.base_url}/artists/{artist['id']}")
                if response.status_code == 200:
                    self.log_test("GET /artists/{id}", True, f"Retrieved artist: {artist['name']}")
                else:
                    self.log_test("GET /artists/{id}", False, f"Status: {response.status_code}")
                    
                return True
            else:
                self.log_test("POST /artists", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /artists", False, f"Error: {str(e)}")
            return False

    def test_albums_crud(self):
        """Test Albums CRUD operations"""
        # Need an artist first
        if not self.created_entities['artists']:
            self.log_test("Albums CRUD", False, "No artists available for album creation")
            return False
            
        artist_id = self.created_entities['artists'][0]
        
        # Test GET all albums
        try:
            response = requests.get(f"{self.base_url}/albums")
            if response.status_code == 200:
                albums = response.json()
                self.log_test("GET /albums", True, f"Retrieved {len(albums)} albums")
            else:
                self.log_test("GET /albums", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /albums", False, f"Error: {str(e)}")
            return False

        # Test POST create album
        album_data = {
            "title": "Tum Hi Ho",
            "artist_id": artist_id,
            "cover_url": "https://example.com/tumhiho.jpg",
            "release_date": "2013-04-26"
        }
        
        try:
            response = requests.post(f"{self.base_url}/albums", json=album_data)
            if response.status_code == 200:
                album = response.json()
                self.created_entities['albums'].append(album['id'])
                self.log_test("POST /albums", True, f"Created album: {album['title']}")
                
                # Test GET specific album
                response = requests.get(f"{self.base_url}/albums/{album['id']}")
                if response.status_code == 200:
                    self.log_test("GET /albums/{id}", True, f"Retrieved album: {album['title']}")
                else:
                    self.log_test("GET /albums/{id}", False, f"Status: {response.status_code}")
                    
                return True
            else:
                self.log_test("POST /albums", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /albums", False, f"Error: {str(e)}")
            return False

    def test_songs_crud(self):
        """Test Songs CRUD operations"""
        # Need an artist first
        if not self.created_entities['artists']:
            self.log_test("Songs CRUD", False, "No artists available for song creation")
            return False
            
        artist_id = self.created_entities['artists'][0]
        album_id = self.created_entities['albums'][0] if self.created_entities['albums'] else None
        
        # Test GET all songs
        try:
            response = requests.get(f"{self.base_url}/songs")
            if response.status_code == 200:
                songs = response.json()
                self.log_test("GET /songs", True, f"Retrieved {len(songs)} songs")
            else:
                self.log_test("GET /songs", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /songs", False, f"Error: {str(e)}")
            return False

        # Test POST create song
        song_data = {
            "title": "Tum Hi Ho",
            "artist_id": artist_id,
            "album_id": album_id,
            "duration": "4:22",
            "genre": "Bollywood",
            "audio_url": "https://example.com/tumhiho.mp3",
            "cover_url": "https://example.com/tumhiho.jpg"
        }
        
        try:
            response = requests.post(f"{self.base_url}/songs", json=song_data)
            if response.status_code == 200:
                song = response.json()
                self.created_entities['songs'].append(song['id'])
                self.log_test("POST /songs", True, f"Created song: {song['title']}")
                
                # Test GET specific song
                response = requests.get(f"{self.base_url}/songs/{song['id']}")
                if response.status_code == 200:
                    self.log_test("GET /songs/{id}", True, f"Retrieved song: {song['title']}")
                else:
                    self.log_test("GET /songs/{id}", False, f"Status: {response.status_code}")
                    
                return True
            else:
                self.log_test("POST /songs", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /songs", False, f"Error: {str(e)}")
            return False

    def test_playlists_crud(self):
        """Test Playlists CRUD operations"""
        # Test GET all playlists
        try:
            response = requests.get(f"{self.base_url}/playlists")
            if response.status_code == 200:
                playlists = response.json()
                self.log_test("GET /playlists", True, f"Retrieved {len(playlists)} playlists")
            else:
                self.log_test("GET /playlists", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /playlists", False, f"Error: {str(e)}")
            return False

        # Test POST create playlist
        playlist_data = {
            "name": "Bollywood Hits",
            "description": "Best of Bollywood music",
            "cover_url": "https://example.com/bollywood.jpg"
        }
        
        try:
            response = requests.post(f"{self.base_url}/playlists", json=playlist_data)
            if response.status_code == 200:
                playlist = response.json()
                self.created_entities['playlists'].append(playlist['id'])
                self.log_test("POST /playlists", True, f"Created playlist: {playlist['name']}")
                
                # Test GET specific playlist
                response = requests.get(f"{self.base_url}/playlists/{playlist['id']}")
                if response.status_code == 200:
                    self.log_test("GET /playlists/{id}", True, f"Retrieved playlist: {playlist['name']}")
                else:
                    self.log_test("GET /playlists/{id}", False, f"Status: {response.status_code}")
                    
                return True
            else:
                self.log_test("POST /playlists", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /playlists", False, f"Error: {str(e)}")
            return False

    def test_search_functionality(self):
        """Test search functionality"""
        # Test search with a query
        try:
            response = requests.get(f"{self.base_url}/songs/search?q=Tum")
            if response.status_code == 200:
                results = response.json()
                self.log_test("GET /songs/search", True, f"Search returned results structure: {list(results.keys())}")
                return True
            else:
                self.log_test("GET /songs/search", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /songs/search", False, f"Error: {str(e)}")
            return False

    def test_admin_endpoints(self):
        """Test admin endpoints"""
        # Test admin stats
        try:
            response = requests.get(f"{self.base_url}/admin/stats")
            if response.status_code == 200:
                stats = response.json()
                expected_keys = ['total_songs', 'total_artists', 'total_albums', 'total_playlists']
                if all(key in stats for key in expected_keys):
                    self.log_test("GET /admin/stats", True, f"Stats: {stats}")
                else:
                    self.log_test("GET /admin/stats", False, f"Missing keys in response: {stats}")
                    return False
            else:
                self.log_test("GET /admin/stats", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /admin/stats", False, f"Error: {str(e)}")
            return False

        # Test admin logs
        try:
            response = requests.get(f"{self.base_url}/admin/logs")
            if response.status_code == 200:
                logs = response.json()
                self.log_test("GET /admin/logs", True, f"Retrieved {len(logs)} admin logs")
                return True
            else:
                self.log_test("GET /admin/logs", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /admin/logs", False, f"Error: {str(e)}")
            return False

    def test_error_handling(self):
        """Test error handling"""
        # Test 404 for non-existent song
        try:
            fake_id = str(uuid.uuid4())
            response = requests.get(f"{self.base_url}/songs/{fake_id}")
            if response.status_code == 404:
                self.log_test("404 Error Handling", True, "Properly returns 404 for non-existent song")
            else:
                self.log_test("404 Error Handling", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("404 Error Handling", False, f"Error: {str(e)}")
            return False

        # Test invalid endpoint
        try:
            response = requests.get(f"{self.base_url}/invalid-endpoint")
            if response.status_code == 404:
                self.log_test("Invalid Endpoint", True, "Properly returns 404 for invalid endpoint")
            else:
                self.log_test("Invalid Endpoint", False, f"Expected 404, got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Invalid Endpoint", False, f"Error: {str(e)}")
            return False

        return True

    def test_playlist_song_operations(self):
        """Test playlist song operations"""
        if not self.created_entities['playlists'] or not self.created_entities['songs']:
            self.log_test("Playlist Song Operations", False, "Need playlist and song for testing")
            return False
            
        playlist_id = self.created_entities['playlists'][0]
        song_id = self.created_entities['songs'][0]
        
        # Test adding song to playlist
        try:
            response = requests.post(f"{self.base_url}/playlists/{playlist_id}/songs?song_id={song_id}")
            if response.status_code == 200:
                self.log_test("POST /playlists/{id}/songs", True, "Successfully added song to playlist")
                
                # Test removing song from playlist
                response = requests.delete(f"{self.base_url}/playlists/{playlist_id}/songs/{song_id}")
                if response.status_code == 200:
                    self.log_test("DELETE /playlists/{id}/songs/{song_id}", True, "Successfully removed song from playlist")
                    return True
                else:
                    self.log_test("DELETE /playlists/{id}/songs/{song_id}", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("POST /playlists/{id}/songs", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Playlist Song Operations", False, f"Error: {str(e)}")
            return False

    def test_query_parameters(self):
        """Test query parameters"""
        # Test songs with genre filter
        try:
            response = requests.get(f"{self.base_url}/songs?genre=Bollywood&limit=10")
            if response.status_code == 200:
                songs = response.json()
                self.log_test("Songs with Query Parameters", True, f"Retrieved {len(songs)} songs with genre filter")
            else:
                self.log_test("Songs with Query Parameters", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Songs with Query Parameters", False, f"Error: {str(e)}")
            return False

        # Test playlists with featured filter
        try:
            response = requests.get(f"{self.base_url}/playlists?featured=true")
            if response.status_code == 200:
                playlists = response.json()
                self.log_test("Featured Playlists", True, f"Retrieved {len(playlists)} featured playlists")
                return True
            else:
                self.log_test("Featured Playlists", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Featured Playlists", False, f"Error: {str(e)}")
            return False

    def test_file_upload_endpoints(self):
        """Test file upload endpoints"""
        # Create mock audio file
        audio_content = b"fake audio content for testing"
        audio_files = {'file': ('test_song.mp3', audio_content, 'audio/mpeg')}
        
        # Test audio file upload
        try:
            response = requests.post(f"{self.base_url}/uploads/audio", files=audio_files)
            if response.status_code == 200:
                upload_result = response.json()
                expected_keys = ['filename', 'url', 'message']
                if all(key in upload_result for key in expected_keys):
                    self.log_test("POST /uploads/audio", True, f"Audio upload successful: {upload_result['message']}")
                else:
                    self.log_test("POST /uploads/audio", False, f"Missing keys in response: {upload_result}")
                    return False
            else:
                self.log_test("POST /uploads/audio", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /uploads/audio", False, f"Error: {str(e)}")
            return False

        # Create mock image file
        image_content = b"fake image content for testing"
        image_files = {'file': ('test_cover.jpg', image_content, 'image/jpeg')}
        
        # Test image file upload
        try:
            response = requests.post(f"{self.base_url}/uploads/image", files=image_files)
            if response.status_code == 200:
                upload_result = response.json()
                expected_keys = ['filename', 'url', 'message']
                if all(key in upload_result for key in expected_keys):
                    self.log_test("POST /uploads/image", True, f"Image upload successful: {upload_result['message']}")
                else:
                    self.log_test("POST /uploads/image", False, f"Missing keys in response: {upload_result}")
                    return False
            else:
                self.log_test("POST /uploads/image", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /uploads/image", False, f"Error: {str(e)}")
            return False

        # Test invalid file type for audio upload
        try:
            invalid_files = {'file': ('test.txt', b"text content", 'text/plain')}
            response = requests.post(f"{self.base_url}/uploads/audio", files=invalid_files)
            if response.status_code == 400:
                self.log_test("Audio Upload Validation", True, "Properly rejects non-audio files")
            else:
                self.log_test("Audio Upload Validation", False, f"Expected 400, got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Audio Upload Validation", False, f"Error: {str(e)}")
            return False

        return True

    def test_enhanced_song_creation(self):
        """Test enhanced song creation with file uploads"""
        # Need an artist first
        if not self.created_entities['artists']:
            self.log_test("Enhanced Song Creation", False, "No artists available for song creation")
            return False
            
        artist_id = self.created_entities['artists'][0]
        album_id = self.created_entities['albums'][0] if self.created_entities['albums'] else None
        
        # Create mock files
        audio_content = b"fake audio content for testing"
        image_content = b"fake image content for testing"
        
        # Test song creation with files
        try:
            files = {
                'audio_file': ('bollywood_hit.mp3', audio_content, 'audio/mpeg'),
                'cover_image': ('bollywood_cover.jpg', image_content, 'image/jpeg')
            }
            
            data = {
                'title': 'Kal Ho Naa Ho',
                'artist_id': artist_id,
                'album_id': album_id,
                'duration': '5:12',
                'genre': 'Bollywood'
            }
            
            response = requests.post(f"{self.base_url}/songs/upload", files=files, data=data)
            if response.status_code == 200:
                song = response.json()
                self.created_entities['songs'].append(song['id'])
                self.log_test("POST /songs/upload (with files)", True, f"Created song with files: {song['title']}")
                
                # Verify the song has file URLs
                if song.get('audio_url') and song.get('cover_url'):
                    self.log_test("Song File URLs", True, "Song created with proper file URLs")
                else:
                    self.log_test("Song File URLs", False, f"Missing file URLs: audio_url={song.get('audio_url')}, cover_url={song.get('cover_url')}")
                    return False
                    
            else:
                self.log_test("POST /songs/upload (with files)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /songs/upload (with files)", False, f"Error: {str(e)}")
            return False

        # Test song creation without cover image
        try:
            files = {
                'audio_file': ('another_song.mp3', audio_content, 'audio/mpeg')
            }
            
            data = {
                'title': 'Tere Naam',
                'artist_id': artist_id,
                'duration': '4:30',
                'genre': 'Bollywood'
            }
            
            response = requests.post(f"{self.base_url}/songs/upload", files=files, data=data)
            if response.status_code == 200:
                song = response.json()
                self.created_entities['songs'].append(song['id'])
                self.log_test("POST /songs/upload (audio only)", True, f"Created song without cover: {song['title']}")
                return True
            else:
                self.log_test("POST /songs/upload (audio only)", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("POST /songs/upload (audio only)", False, f"Error: {str(e)}")
            return False

    def test_user_preferences_api(self):
        """Test user preferences API endpoints"""
        # Use a test user ID
        test_user_id = "test_user_123"
        
        # Need entities to test with
        if not self.created_entities['artists'] or not self.created_entities['songs']:
            self.log_test("User Preferences API", False, "Need artists and songs for testing")
            return False
            
        artist_id = self.created_entities['artists'][0]
        song_id = self.created_entities['songs'][0]
        album_id = self.created_entities['albums'][0] if self.created_entities['albums'] else None
        
        # Test get user preferences (should create if not exists)
        try:
            response = requests.get(f"{self.base_url}/users/{test_user_id}/preferences")
            if response.status_code == 200:
                preferences = response.json()
                expected_keys = ['user_id', 'liked_songs', 'followed_artists', 'saved_albums']
                if all(key in preferences for key in expected_keys):
                    self.log_test("GET /users/{id}/preferences", True, f"Retrieved user preferences: {preferences['user_id']}")
                else:
                    self.log_test("GET /users/{id}/preferences", False, f"Missing keys in response: {preferences}")
                    return False
            else:
                self.log_test("GET /users/{id}/preferences", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /users/{id}/preferences", False, f"Error: {str(e)}")
            return False

        # Test like song (toggle)
        try:
            response = requests.post(f"{self.base_url}/users/{test_user_id}/like-song/{song_id}")
            if response.status_code == 200:
                result = response.json()
                if 'message' in result and 'is_liked' in result:
                    self.log_test("POST /users/{id}/like-song/{song_id}", True, f"Song like toggled: {result['message']}")
                    
                    # Test toggle again (unlike)
                    response = requests.post(f"{self.base_url}/users/{test_user_id}/like-song/{song_id}")
                    if response.status_code == 200:
                        result2 = response.json()
                        if result['is_liked'] != result2['is_liked']:
                            self.log_test("Song Like Toggle", True, "Song like/unlike toggle working correctly")
                        else:
                            self.log_test("Song Like Toggle", False, "Toggle not working properly")
                            return False
                    else:
                        self.log_test("Song Like Toggle", False, f"Second toggle failed: {response.status_code}")
                        return False
                else:
                    self.log_test("POST /users/{id}/like-song/{song_id}", False, f"Missing keys in response: {result}")
                    return False
            else:
                self.log_test("POST /users/{id}/like-song/{song_id}", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("POST /users/{id}/like-song/{song_id}", False, f"Error: {str(e)}")
            return False

        # Test follow artist
        try:
            response = requests.post(f"{self.base_url}/users/{test_user_id}/follow-artist/{artist_id}")
            if response.status_code == 200:
                result = response.json()
                if 'message' in result and 'is_following' in result:
                    self.log_test("POST /users/{id}/follow-artist/{artist_id}", True, f"Artist follow toggled: {result['message']}")
                else:
                    self.log_test("POST /users/{id}/follow-artist/{artist_id}", False, f"Missing keys in response: {result}")
                    return False
            else:
                self.log_test("POST /users/{id}/follow-artist/{artist_id}", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("POST /users/{id}/follow-artist/{artist_id}", False, f"Error: {str(e)}")
            return False

        # Test save album (if album exists)
        if album_id:
            try:
                response = requests.post(f"{self.base_url}/users/{test_user_id}/save-album/{album_id}")
                if response.status_code == 200:
                    result = response.json()
                    if 'message' in result and 'is_saved' in result:
                        self.log_test("POST /users/{id}/save-album/{album_id}", True, f"Album save toggled: {result['message']}")
                    else:
                        self.log_test("POST /users/{id}/save-album/{album_id}", False, f"Missing keys in response: {result}")
                        return False
                else:
                    self.log_test("POST /users/{id}/save-album/{album_id}", False, f"Status: {response.status_code}")
                    return False
            except Exception as e:
                self.log_test("POST /users/{id}/save-album/{album_id}", False, f"Error: {str(e)}")
                return False

        # Test get liked songs
        try:
            response = requests.get(f"{self.base_url}/users/{test_user_id}/liked-songs")
            if response.status_code == 200:
                result = response.json()
                if 'songs' in result and 'total' in result:
                    self.log_test("GET /users/{id}/liked-songs", True, f"Retrieved {result['total']} liked songs")
                else:
                    self.log_test("GET /users/{id}/liked-songs", False, f"Missing keys in response: {result}")
                    return False
            else:
                self.log_test("GET /users/{id}/liked-songs", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /users/{id}/liked-songs", False, f"Error: {str(e)}")
            return False

        # Test get followed artists
        try:
            response = requests.get(f"{self.base_url}/users/{test_user_id}/followed-artists")
            if response.status_code == 200:
                result = response.json()
                if 'artists' in result and 'total' in result:
                    self.log_test("GET /users/{id}/followed-artists", True, f"Retrieved {result['total']} followed artists")
                else:
                    self.log_test("GET /users/{id}/followed-artists", False, f"Missing keys in response: {result}")
                    return False
            else:
                self.log_test("GET /users/{id}/followed-artists", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /users/{id}/followed-artists", False, f"Error: {str(e)}")
            return False

        # Test get saved albums
        try:
            response = requests.get(f"{self.base_url}/users/{test_user_id}/saved-albums")
            if response.status_code == 200:
                result = response.json()
                if 'albums' in result and 'total' in result:
                    self.log_test("GET /users/{id}/saved-albums", True, f"Retrieved {result['total']} saved albums")
                    return True
                else:
                    self.log_test("GET /users/{id}/saved-albums", False, f"Missing keys in response: {result}")
                    return False
            else:
                self.log_test("GET /users/{id}/saved-albums", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("GET /users/{id}/saved-albums", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting YantraTune Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("Health Check", self.test_health_check),
            ("Artists CRUD", self.test_artists_crud),
            ("Albums CRUD", self.test_albums_crud),
            ("Songs CRUD", self.test_songs_crud),
            ("Playlists CRUD", self.test_playlists_crud),
            ("File Upload Endpoints", self.test_file_upload_endpoints),
            ("Enhanced Song Creation", self.test_enhanced_song_creation),
            ("User Preferences API", self.test_user_preferences_api),
            ("Search Functionality", self.test_search_functionality),
            ("Admin Endpoints", self.test_admin_endpoints),
            ("Query Parameters", self.test_query_parameters),
            ("Playlist Song Operations", self.test_playlist_song_operations),
            ("Error Handling", self.test_error_handling),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            print(f"🧪 Running {test_name}...")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL: {test_name} - Unexpected error: {str(e)}")
                failed += 1
            print("-" * 40)
        
        # Summary
        print("=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        if failed == 0:
            print("🎉 All tests passed! YantraTune backend is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the details above.")
            
        return failed == 0

def main():
    """Main test runner"""
    tester = YantraTuneAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())