"""
Flask API Server - Track India
Real data integration with data.gov.in, NewsAPI, and RAG/Gemini AI
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import threading
import os

# Import real data modules
from data_fetcher import fetcher
from rag.build_vector_db import get_builder
from rag.query_rag import initialize_rag, get_rag_query

app = Flask(__name__)
CORS(app)

# Global initialization
_initialized = False
_init_lock = threading.Lock()

def initialize_system():
    """Initialize data fetcher, vector DB, and RAG system"""
    global _initialized
    
    with _init_lock:
        if _initialized:
            return
        
        try:
            print("\n" + "="*60)
            print("🚀 INITIALIZING TRACK INDIA SYSTEM")
            print("="*60)
            
            # Step 1: Start data fetcher scheduler
            print("\n1️⃣ Starting data fetcher (6-hour schedule)...")
            fetcher.start_scheduler()
            
            # Step 2: Build vector database
            print("\n2️⃣ Building vector database...")
            builder = get_builder()
            
            # Try to build from existing data first
            success = builder.build_from_file('data/fetched_data.json')
            
            if not success:
                print("   No existing data found, will fetch on first run...")
            
            # Step 3: Initialize RAG system
            print("\n3️⃣ Initializing RAG query system...")
            initialize_rag(builder.collection)
            
            print("\n" + "="*60)
            print("✅ SYSTEM INITIALIZED SUCCESSFULLY")
            print("="*60 + "\n")
            
            _initialized = True
            
        except Exception as e:
            print(f"\n❌ Initialization failed: {e}")
            print("   App will continue but features may be limited\n")

# Initialize on first request
@app.before_request
def before_first_request():
    initialize_system()

# Health check endpoint
@app.route('/')
def home():
    db_status = "connected" if db is not None else "disconnected"
    collections = list(db.list_collection_names()) if db is not None else []
    
    return jsonify({
        'status': 'online',
        'service': 'Track India API',
        'version': '2.0',
        'data_source': 'Real API (data.gov.in + NewsAPI)',
        'timestamp': datetime.now().isoformat()
    })

# Real data endpoints
@app.route('/api/updates')
def get_updates():
    """Get real government updates from fetched data"""
    try:
        # Get filter parameters
        update_type = request.args.get('type', 'all')
        limit = int(request.args.get('limit', 20))
        
        # Get cached data from fetcher
        all_data = fetcher.get_cached_data()
        
        if not all_data:
            return jsonify({
                'success': False,
                'error': 'No data available yet',
                'message': 'Data is being fetched. Please try again in a few moments.'
            }), 503
        
        # Filter by type if specified
        if update_type != 'all':
            filtered_data = [item for item in all_data if item.get('type') == update_type]
        else:
            filtered_data = all_data
        
        # Limit results
        limited_data = filtered_data[:limit]
        
        # Return in expected format
        return jsonify({
            'success': True,
            'data': limited_data,
            'total': len(all_data),
            'filtered': len(filtered_data),
            'last_updated': datetime.now().isoformat(),
            'next_update_in': '6 hours'
        })
        
    except Exception as e:
        print(f"Error in /api/updates: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/updates/<update_id>')
def get_update_by_id(update_id):
    """Get a specific update by its ID"""
    try:
        # Get cached data from fetcher
        all_data = fetcher.get_cached_data()
        
        if not all_data:
            return jsonify({
                'success': False,
                'error': 'No data available'
            }), 503
        
        # Find the specific update
        update = next((item for item in all_data if item.get('id') == update_id), None)
        
        if not update:
            return jsonify({
                'success': False,
                'error': 'Update not found'
            }), 404
        
        # Get related updates (same type, different ID)
        related = [
            item for item in all_data 
            if item.get('type') == update.get('type') and item.get('id') != update_id
        ][:5]
        
        return jsonify({
            'success': True,
            'data': update,
            'related': related,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in /api/updates/<id>: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/trends')
def get_trends():
    """Generate trends from real data"""
    try:
        data = fetcher.get_cached_data()
        
        if not data:
            return jsonify({'error': 'No data available'}), 503
        
        # Count by type
        types = {}
        for item in data:
            item_type = item.get('type', 'unknown')
            types[item_type] = types.get(item_type, 0) + 1
        
        # Format for charts
        trend_data = {
            'labels': list(types.keys()),
            'datasets': [{
                'label': 'Projects by Type',
                'data': list(types.values())
            }]
        }
        
        return jsonify(trend_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/drivers')
def get_drivers():
    """Get key drivers from real data"""
    try:
        data = fetcher.get_cached_data()
        
        if not data:
            return jsonify({'error': 'No data available'}), 503
        
        # Count by ministry
        ministries = {}
        for item in data:
            ministry = item.get('ministry', 'Unknown')
            ministries[ministry] = ministries.get(ministry, 0) + 1
        
        # Get top 10 ministries
        top_ministries = sorted(
            ministries.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:10]
        
        drivers = [
            {
                'name': ministry,
                'value': count,
                'change': f'+{count} projects'
            }
            for ministry, count in top_ministries
        ]
        
        return jsonify(drivers)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """RAG-powered chat endpoint using Gemini AI"""
    try:
        # Get query from request
        query = request.json.get('query', '')
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
        
        # Get RAG instance
        rag = get_rag_query()
        
        if not rag:
            return jsonify({
                'error': 'RAG system not initialized',
                'message': 'The AI system is still starting up. Please try again in a moment.'
            }), 503
        
        # Query the RAG system
        result = rag.query(query, top_k=5, return_sources=True)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return jsonify({
            'error': 'Failed to process query',
            'message': str(e)
        }), 500

@app.route('/api/stats')
def get_stats():
    """Get system statistics for Live Updates page"""
    try:
        # Get cached data
        cached_data = fetcher.get_cached_data()
        
        # Count by status
        active_count = sum(1 for item in cached_data if item.get('status') == 'active')
        completed_count = sum(1 for item in cached_data if item.get('status') == 'completed')
        
        # Count by type
        policies_count = sum(1 for item in cached_data if item.get('type') == 'policy')
        
        # Calculate total funding (mock for now)
        total_funding = f"₹{len(cached_data) * 1000}Cr"
        
        stats_data = {
            'active_projects': active_count,
            'total_funding': total_funding,
            'new_policies': policies_count,
            'completed': completed_count
        }
        
        # Vector DB stats (optional, for debugging)
        try:
            builder = get_builder()
            vector_count = builder.get_stats()
            
            print("\n📊 Vector DB Statistics")
            print(f"   Collection: government_data")
            print(f"   Total records: {vector_count}")
            print(f"   Embedding dimensions: 384")
            print(f"   Model: all-MiniLM-L6-v2")
        except:
            pass
        
        return jsonify({
            'success': True,
            'data': stats_data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in /api/stats: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/search')
def search():
    """Search government data"""
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({'error': 'No search query provided'}), 400
        
        data = fetcher.get_cached_data()
        
        # Simple text search
        results = [
            item for item in data
            if query.lower() in item.get('title', '').lower()
            or query.lower() in item.get('description', '').lower()
        ]
        
        return jsonify({
            'query': query,
            'count': len(results),
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Track India API Server...")
    print("   Port: 8010")
    print("   Data Sources: data.gov.in + NewsAPI")
    print("   AI: Gemini Pro with RAG")
    print("\n")
    app.run(debug=True, port=8010, host='0.0.0.0')
