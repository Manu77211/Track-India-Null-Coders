# Track India - Python Backend

Real-time government data tracking system with AI-powered chat using RAG (Retrieval Augmented Generation).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file with:

```env
# Required API Keys
GEMINI_API_KEY=your_gemini_key
API_KEY=your_data_gov_in_key
NEWS_API_KEY=your_newsapi_key
CHROMA_API=your_chromadb_key
```

### 3. Run the Server

```bash
python app.py
```

Server runs on: http://localhost:8010

## 📡 API Endpoints

### Data Endpoints

- `GET /` - Health check
- `GET /api/updates` - Get all government updates
- `GET /api/trends` - Get data trends by type
- `GET /api/drivers` - Get top ministries by project count
- `GET /api/stats` - System statistics
- `GET /api/search?q=query` - Search government data

### AI Chat Endpoint

- `POST /api/chat` - RAG-powered AI chat with Gemini
  ```json
  {
    "query": "What infrastructure projects are happening in India?"
  }
  ```

## 🔧 Architecture

```
Data Sources (Every 6 hours)
  ├── data.gov.in API
  └── NewsAPI
       ↓
data_fetcher.py (Automatic scheduling)
       ↓
data/fetched_data.json (Cache)
       ↓
rag/build_vector_db.py (Embeddings)
       ↓
ChromaDB (Vector database)
       ↓
rag/query_rag.py + Gemini AI
       ↓
Flask API Endpoints
```

## 📁 Project Structure

```
python/
├── app.py                      # Main Flask server
├── data_fetcher.py            # Automatic data fetching (6-hour intervals)
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables (create this)
├── rag/
│   ├── build_vector_db.py    # Vector database builder
│   └── query_rag.py          # RAG query system with Gemini
└── data/
    └── fetched_data.json     # Cached data (auto-generated)
```

## 🎯 Features

- ✅ **Real Data** - Fetches from data.gov.in and NewsAPI
- ✅ **Automatic Updates** - Data refreshes every 6 hours
- ✅ **Vector Search** - Semantic search using sentence transformers
- ✅ **AI Chat** - Gemini Pro with RAG for intelligent responses
- ✅ **Source Citations** - Every AI response includes source documents
- ✅ **No Mock Data** - All endpoints use real government data

## 🔑 API Keys Setup

### 1. data.gov.in API Key

- Visit: https://data.gov.in/
- Register for free account
- Get API key from your dashboard

### 2. NewsAPI Key

- Visit: https://newsapi.org/register
- Free tier: 100 requests/day
- Get your API key

### 3. Gemini API Key

- Visit: https://makersuite.google.com/app/apikey
- Get your Gemini API key

### 4. ChromaDB Cloud Key

- Visit: https://www.trychroma.com/
- Sign up and get your API key

## 🧪 Testing

Test data fetcher:

```bash
python data_fetcher.py
```

Build vector database:

```bash
python rag/build_vector_db.py
```

Test API endpoints:

```bash
# Get updates
curl http://localhost:8010/api/updates

# Get stats
curl http://localhost:8010/api/stats

# Chat with AI
curl -X POST http://localhost:8010/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Tell me about recent infrastructure projects"}'
```

## 🐛 Troubleshooting

**"No data available"**

- Wait a few moments for initial data fetch
- Check if API keys are valid in `.env`

**"RAG system not initialized"**

- Ensure ChromaDB API key is correct
- Check if embedding model downloaded successfully

**Import errors**

- Run: `pip install -r requirements.txt`
- Ensure Python 3.8+ is installed

## 📦 Dependencies

Core packages:

- Flask 3.0.0 - Web server
- chromadb - Vector database
- sentence-transformers - Text embeddings
- google-generativeai - Gemini AI
- apscheduler - Background job scheduling

See `requirements.txt` for full list.

## 🔄 Data Pipeline

1. **Fetch** - APScheduler triggers every 6 hours
2. **Process** - Classify and extract metadata
3. **Store** - Save to `data/fetched_data.json`
4. **Embed** - Generate 384-dim vectors
5. **Index** - Store in ChromaDB
6. **Query** - RAG search + Gemini response

## 📊 System Status

Check system health:

```bash
curl http://localhost:8010/api/stats
```

Returns:

```json
{
  "vector_db": {
    "total_records": 150,
    "collection_name": "government_data"
  },
  "data_fetcher": {
    "cached_records": 150,
    "last_fetch": "2024-10-25T10:30:00",
    "next_fetch": "6 hours from last fetch"
  },
  "status": "operational"
}
```

## 🎉 Production Ready

- ✅ No mock/fake data
- ✅ Error handling with fallbacks
- ✅ Automatic data updates
- ✅ Background scheduling
- ✅ Source citations
- ✅ Vector search
- ✅ AI-powered responses

---

**Version:** 2.0  
**Last Updated:** October 25, 2024  
**Status:** Production Ready 🚀
