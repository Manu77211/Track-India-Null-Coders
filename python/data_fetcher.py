"""
Data Fetcher - Automatically fetches Indian government/infrastructure news from free APIs
Runs every 6 hours and updates the vector database
"""
import requests
import json
import time
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import os
from dotenv import load_dotenv

load_dotenv()

class DataFetcher:
    def __init__(self):
        # NewsAPI.org - Free tier (100 requests/day)
        # Sign up at: https://newsapi.org/register
        self.news_api_key = os.getenv("NEWS_API_KEY", "")
        
        # API.GovData.in API key (if available)
        self.govdata_api_key = os.getenv("API_KEY", "")
        
        self.data_cache = []
        self.last_fetch_time = None
        
    def fetch_from_newsapi(self):
        """Fetch Indian infrastructure/government news from NewsAPI"""
        try:
            if not self.news_api_key:
                print("⚠️  NEWS_API_KEY not found. Using fallback data...")
                return self._get_fallback_data()
            
            url = "https://newsapi.org/v2/everything"
            
            # Fetch news about Indian government, infrastructure, policy
            # Remove domain filter to get more results
            params = {
                'apiKey': self.news_api_key,
                'q': 'India AND (government OR infrastructure OR policy OR development)',
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': 50,  # Free tier allows up to 100
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Check for API errors
            if data.get('status') != 'ok':
                print(f"❌ NewsAPI error: {data.get('message', 'Unknown error')}")
                return self._get_fallback_data()
            
            articles = data.get('articles', [])
            
            print(f"✅ Fetched {len(articles)} articles from NewsAPI")
            
            if len(articles) == 0:
                print("⚠️  No articles found, using fallback data")
                return self._get_fallback_data()
            
            return self._process_news_data(articles)
            
        except requests.exceptions.RequestException as e:
            print(f"❌ NewsAPI fetch failed: {e}")
            return self._get_fallback_data()
        except Exception as e:
            print(f"❌ Error processing NewsAPI data: {e}")
            return self._get_fallback_data()
    
    def fetch_from_govdata_api(self):
        """Fetch data from data.gov.in API"""
        try:
            if not self.govdata_api_key:
                print("⚠️  Data.gov.in API key not found. Skipping...")
                return []
            
            # Data.gov.in API uses catalog search
            # Let's search for infrastructure and development related datasets
            all_data = []
            
            # Search for relevant datasets
            search_queries = [
                'infrastructure',
                'smart city',
                'development projects'
            ]
            
            for query in search_queries[:1]:  # Only use first query to avoid rate limits
                try:
                    # Use the catalog API to search datasets
                    url = "https://api.data.gov.in/catalog/search"
                    params = {
                        'api-key': self.govdata_api_key,
                        'format': 'json',
                        'q': query,
                        'limit': 10
                    }
                    
                    response = requests.get(url, params=params, timeout=15)
                    
                    if response.status_code == 200:
                        data = response.json()
                        # data.gov.in catalog returns datasets metadata
                        datasets = data.get('records', [])
                        
                        if datasets:
                            print(f"✅ Found {len(datasets)} datasets from data.gov.in")
                            # Process catalog results
                            all_data.extend(datasets[:5])  # Limit to 5 datasets
                        else:
                            print(f"⚠️  No datasets found for query: {query}")
                    else:
                        print(f"⚠️  Data.gov.in returned status {response.status_code}")
                        
                except Exception as e:
                    print(f"⚠️  Failed to search data.gov.in for '{query}': {e}")
                    continue
            
            return self._process_govdata(all_data) if all_data else []
            
        except Exception as e:
            print(f"⚠️  Data.gov.in API fetch failed: {e}")
            return []
    
    def _process_news_data(self, articles):
        """Convert news articles to structured format"""
        processed_data = []
        
        for idx, article in enumerate(articles):
            # Extract relevant information
            processed = {
                'id': f"news_{idx}_{int(time.time())}",
                'type': self._classify_type(article.get('title', '') + article.get('description', '')),
                'title': article.get('title', 'No title'),
                'description': article.get('description', '') or article.get('content', ''),
                'location': 'India',  # Default to India for Indian news
                'date': article.get('publishedAt', datetime.now().isoformat())[:10],
                'status': 'active',
                'priority': 'medium',
                'ministry': self._extract_ministry(article.get('title', '') + article.get('description', '')),
                'impact': 75,  # Default impact score
                'source': article.get('source', {}).get('name', 'Unknown'),
                'url': article.get('url', ''),
                'image': article.get('urlToImage', ''),
                'content': article.get('content', '')[:500]  # Limit content length
            }
            
            processed_data.append(processed)
        
        return processed_data
    
    def _classify_type(self, text):
        """Classify news type based on keywords"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['road', 'railway', 'metro', 'highway', 'bridge', 'airport', 'port']):
            return 'infrastructure'
        elif any(word in text_lower for word in ['fund', 'budget', 'allocation', 'investment', 'crore', 'lakh']):
            return 'funding'
        elif any(word in text_lower for word in ['policy', 'bill', 'act', 'law', 'regulation', 'reform']):
            return 'policy'
        elif any(word in text_lower for word in ['launch', 'inaugurat', 'announc', 'unveil']):
            return 'announcement'
        else:
            return 'announcement'
    
    def _extract_ministry(self, text):
        """Try to extract ministry name from text"""
        ministries = {
            'railways': 'Ministry of Railways',
            'road': 'Ministry of Road Transport and Highways',
            'health': 'Ministry of Health and Family Welfare',
            'education': 'Ministry of Education',
            'finance': 'Ministry of Finance',
            'housing': 'Ministry of Housing and Urban Affairs',
            'power': 'Ministry of Power',
            'commerce': 'Ministry of Commerce and Industry',
            'defence': 'Ministry of Defence',
            'home': 'Ministry of Home Affairs'
        }
        
        text_lower = text.lower()
        for keyword, ministry in ministries.items():
            if keyword in text_lower:
                return ministry
        
        return 'Government of India'
    
    def _get_fallback_data(self):
        """Return minimal fallback data when API is unavailable"""
        return [
            {
                'id': f'fallback_{int(time.time())}',
                'type': 'infrastructure',
                'title': 'API Data Fetching Active',
                'description': 'Real-time government data fetching is configured. Add NEWS_API_KEY to .env to enable live data.',
                'location': 'India',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'status': 'active',
                'priority': 'medium',
                'ministry': 'System',
                'impact': 50
            }
        ]
    
    def _process_govdata(self, data):
        """Process data from data.gov.in API"""
        processed_data = []
        
        for idx, record in enumerate(data):
            try:
                # Process government data records
                processed = {
                    'id': f"govdata_{idx}_{int(time.time())}",
                    'type': 'government_data',
                    'title': record.get('title', record.get('scheme_name', record.get('project_name', 'Government Initiative'))),
                    'description': record.get('description', record.get('details', 'Government data from data.gov.in')),
                    'location': record.get('state', record.get('district', 'India')),
                    'date': record.get('date', record.get('year', datetime.now().strftime('%Y-%m-%d'))),
                    'status': 'active',
                    'priority': 'medium',
                    'ministry': record.get('ministry', record.get('department', 'Government of India')),
                    'impact': 80,
                    'source': 'data.gov.in',
                    'raw_data': record  # Keep original data for reference
                }
                
                processed_data.append(processed)
                
            except Exception as e:
                print(f"⚠️  Error processing record {idx}: {e}")
                continue
        
        return processed_data
    
    def fetch_all_data(self):
        """Main function to fetch data from all sources"""
        print("\n" + "="*60)
        print(f"🔄 Starting data fetch at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        
        all_data = []
        
        # Fetch from NewsAPI
        news_data = self.fetch_from_newsapi()
        all_data.extend(news_data)
        
        # Fetch from GovData API
        govdata = self.fetch_from_govdata_api()
        all_data.extend(govdata)
        
        # Update cache
        self.data_cache = all_data
        self.last_fetch_time = datetime.now()
        
        # Save to file for persistence
        try:
            os.makedirs('data', exist_ok=True)
            with open('data/fetched_data.json', 'w', encoding='utf-8') as f:
                json.dump({
                    'last_updated': self.last_fetch_time.isoformat(),
                    'count': len(all_data),
                    'data': all_data
                }, f, indent=2, ensure_ascii=False)
            print(f"💾 Saved {len(all_data)} records to data/fetched_data.json")
        except Exception as e:
            print(f"⚠️  Could not save to file: {e}")
        
        print(f"✅ Total records fetched: {len(all_data)}")
        
        # Automatically update vector database
        self._update_vector_db(all_data)
        
        print("="*60 + "\n")
        
        return all_data
    
    def _update_vector_db(self, data):
        """Automatically update vector database with new data"""
        try:
            print("\n🔄 Updating vector database...")
            
            # Import here to avoid circular imports
            from rag.build_vector_db import get_builder
            
            builder = get_builder()
            
            # Use incremental update to avoid rebuilding entire DB
            success = builder.update_incremental(data)
            
            if success:
                print("✅ Vector database updated successfully")
            else:
                print("⚠️  Vector database update had issues")
                
        except Exception as e:
            print(f"⚠️  Could not update vector database: {e}")
            print("   Vector DB will be updated on next app restart")
    
    def get_cached_data(self):
        """Return cached data or fetch if cache is empty"""
        if not self.data_cache:
            # Try to load from file first
            try:
                with open('data/fetched_data.json', 'r', encoding='utf-8') as f:
                    cached = json.load(f)
                    self.data_cache = cached.get('data', [])
                    print(f"📂 Loaded {len(self.data_cache)} records from cache")
            except FileNotFoundError:
                print("📥 No cache found, fetching fresh data...")
                self.fetch_all_data()
        
        return self.data_cache
    
    def start_scheduler(self):
        """Start background scheduler to fetch data every 6 hours"""
        scheduler = BackgroundScheduler()
        
        # Check if we have recent data (less than 6 hours old)
        should_fetch_now = True
        try:
            with open('data/fetched_data.json', 'r', encoding='utf-8') as f:
                cached = json.load(f)
                last_updated_str = cached.get('last_updated', '')
                
                if last_updated_str:
                    last_updated = datetime.fromisoformat(last_updated_str)
                    time_since_update = datetime.now() - last_updated
                    
                    if time_since_update < timedelta(hours=6):
                        should_fetch_now = False
                        print(f"📂 Using cached data from {time_since_update.seconds // 3600}h {(time_since_update.seconds % 3600) // 60}m ago")
                        print(f"   Next fetch in {6 - (time_since_update.seconds // 3600)}h")
        except (FileNotFoundError, json.JSONDecodeError, ValueError):
            print("📥 No recent cache found, will fetch immediately...")
        
        # Fetch immediately only if data is old or missing
        if should_fetch_now:
            self.fetch_all_data()
        
        # Schedule to run every 6 hours
        scheduler.add_job(
            func=self.fetch_all_data,
            trigger=IntervalTrigger(hours=6),
            id='data_fetch_job',
            name='Fetch government data every 6 hours',
            replace_existing=True
        )
        
        scheduler.start()
        print("🚀 Data fetcher scheduler started! Will fetch every 6 hours.")
        
        # Calculate next fetch time
        if not should_fetch_now:
            try:
                with open('data/fetched_data.json', 'r', encoding='utf-8') as f:
                    cached = json.load(f)
                    last_updated = datetime.fromisoformat(cached.get('last_updated', ''))
                    next_fetch = last_updated + timedelta(hours=6)
                    print(f"   Next fetch at: {next_fetch.strftime('%Y-%m-%d %H:%M:%S')}")
            except:
                pass
        else:
            next_fetch = datetime.now() + timedelta(hours=6)
            print(f"   Next fetch at: {next_fetch.strftime('%Y-%m-%d %H:%M:%S')}")
        
        return scheduler

# Global instance
fetcher = DataFetcher()

if __name__ == "__main__":
    # Test the fetcher
    print("Testing Data Fetcher...")
    data = fetcher.fetch_all_data()
    print(f"\nFetched {len(data)} records")
    
    if data:
        print("\nSample record:")
        print(json.dumps(data[0], indent=2))
