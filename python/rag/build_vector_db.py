"""
Vector Database Builder - Updated to work with API-fetched data
Builds and updates ChromaDB collection with embeddings from real data
"""
import os
import json
import chromadb
from sentence_transformers import SentenceTransformer
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class VectorDBBuilder:
    def __init__(self):
        # Load Chroma Cloud API key
        self.chroma_api_key = os.getenv("CHROMA_API")
        if not self.chroma_api_key:
            raise ValueError("❌ Please set CHROMA_API in .env")
        
        # Initialize Hugging Face model
        print("📥 Loading embedding model...")
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        print("✅ Model loaded: all-MiniLM-L6-v2 (384 dimensions)")
        
        # Chroma Cloud client
        try:
            self.client = chromadb.CloudClient(
                api_key=self.chroma_api_key,
                tenant="2a5e9e54-7155-4ae8-b0f1-3bde91b5ecf0",
                database="rag_db"
            )
            print("✅ Connected to ChromaDB Cloud")
        except Exception as e:
            print(f"⚠️  ChromaDB Cloud connection issue: {e}")
            print("   Falling back to local ChromaDB...")
            self.client = chromadb.Client()
        
        # Get or create collection
        self.collection_name = "government_data"
        self.collection = self.client.get_or_create_collection(name=self.collection_name)
    
    def flatten_record(self, record):
        """Convert record dict to searchable text"""
        parts = []
        
        # Add all fields in a structured way
        for key, value in record.items():
            if key not in ['id', 'image', 'url']:  # Skip non-text fields
                parts.append(f"{key}: {value}")
        
        return " | ".join(parts)
    
    def build_from_file(self, file_path="data/fetched_data.json"):
        """Build vector DB from saved data file"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data_container = json.load(f)
            
            # Extract data array
            if isinstance(data_container, dict):
                data = data_container.get('data', [])
                last_updated = data_container.get('last_updated', 'Unknown')
            else:
                data = data_container
                last_updated = datetime.now().isoformat()
            
            print(f"\n📂 Loading data from {file_path}")
            print(f"   Last updated: {last_updated}")
            print(f"   Records found: {len(data)}")
            
            return self._add_to_vector_db(data)
            
        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
            print("   Run data_fetcher.py first to fetch data")
            return False
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def build_from_data(self, data):
        """Build vector DB directly from data array"""
        print(f"\n📥 Building vector DB from {len(data)} records")
        return self._add_to_vector_db(data)
    
    def _add_to_vector_db(self, data):
        """Internal method to add data to vector DB"""
        if not data:
            print("⚠️  No data to add to vector DB")
            return False
        
        print("\n" + "="*60)
        print("🔨 Building Vector Database")
        print("="*60)
        
        texts = []
        ids = []
        metadatas = []
        
        # Prepare data
        for idx, record in enumerate(data):
            text = self.flatten_record(record)
            texts.append(text)
            ids.append(record.get('id', f'doc_{idx}'))
            
            # Store metadata
            metadata = {
                'type': record.get('type', 'unknown'),
                'title': record.get('title', 'No title')[:200],  # Limit length
                'date': record.get('date', ''),
                'ministry': record.get('ministry', 'Unknown'),
                'source': record.get('source', 'Unknown')
            }
            metadatas.append(metadata)
        
        # Generate embeddings and add to ChromaDB in batches
        batch_size = 50
        total_added = 0
        
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i+batch_size]
            batch_ids = ids[i:i+batch_size]
            batch_metadatas = metadatas[i:i+batch_size]
            
            # Generate embeddings for batch
            print(f"   Processing batch {i//batch_size + 1}/{(len(texts) + batch_size - 1)//batch_size}...")
            embeddings = self.model.encode(batch_texts).tolist()
            
            try:
                # Add to ChromaDB
                self.collection.add(
                    documents=batch_texts,
                    metadatas=batch_metadatas,
                    ids=batch_ids,
                    embeddings=embeddings
                )
                total_added += len(batch_texts)
                print(f"   ✅ Added {len(batch_texts)} records (Total: {total_added})")
                
                # Pause to avoid overwhelming the API
                if i + batch_size < len(texts):
                    time.sleep(0.5)
                    
            except Exception as e:
                print(f"   ⚠️  Error adding batch: {e}")
                continue
        
        print("="*60)
        print(f"✅ Vector DB built successfully!")
        print(f"   Collection: {self.collection_name}")
        print(f"   Total records: {total_added}")
        print(f"   Embedding model: all-MiniLM-L6-v2")
        print(f"   Dimensions: 384")
        print("="*60 + "\n")
        
        return True
    
    def update_incremental(self, new_data):
        """Update vector DB with new data (incremental updates)"""
        print(f"\n🔄 Incremental update with {len(new_data)} new records")
        
        # Check which IDs already exist
        existing_ids = set()
        try:
            # Get all existing IDs
            result = self.collection.get()
            existing_ids = set(result.get('ids', []))
            print(f"   Found {len(existing_ids)} existing records")
        except Exception as e:
            print(f"   Could not fetch existing IDs: {e}")
        
        # Filter out existing records
        new_records = [r for r in new_data if r.get('id') not in existing_ids]
        
        if not new_records:
            print("   ℹ️  No new records to add")
            return True
        
        print(f"   Adding {len(new_records)} new records...")
        return self._add_to_vector_db(new_records)
    
    def clear_collection(self):
        """Clear all data from the collection"""
        try:
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.get_or_create_collection(name=self.collection_name)
            print(f"✅ Cleared collection: {self.collection_name}")
            return True
        except Exception as e:
            print(f"❌ Error clearing collection: {e}")
            return False
    
    def get_stats(self):
        """Get collection statistics"""
        try:
            result = self.collection.get()
            count = len(result.get('ids', []))
            
            print(f"\n📊 Vector DB Statistics")
            print(f"   Collection: {self.collection_name}")
            print(f"   Total records: {count}")
            print(f"   Embedding dimensions: 384")
            print(f"   Model: all-MiniLM-L6-v2")
            
            return count
        except Exception as e:
            print(f"❌ Error getting stats: {e}")
            return 0

# Singleton instance
_builder = None

def get_builder():
    """Get or create VectorDBBuilder singleton"""
    global _builder
    if _builder is None:
        _builder = VectorDBBuilder()
    return _builder

if __name__ == "__main__":
    # Test building from file
    print("Testing Vector DB Builder...")
    builder = VectorDBBuilder()
    
    # Try to build from fetched data
    success = builder.build_from_file("../data/fetched_data.json")
    
    if success:
        builder.get_stats()
    else:
        print("\n⚠️  Could not build vector DB.")
        print("   Make sure to run data_fetcher.py first!")
