# Track India - Backend API Server

> AI-powered Flask backend for Indian infrastructure development tracking with RAG (Retrieval-Augmented Generation) and automated data fetching

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector%20DB-orange.svg)](https://www.trychroma.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Data Pipeline](#data-pipeline)
- [RAG System](#rag-system)
- [Development](#development)

---

## 🎯 Overview

Track India Backend is a sophisticated Flask-based API server that provides real-time infrastructure development data, AI-powered chat capabilities, and predictive analytics for Indian government projects. The system automatically fetches data from multiple sources, processes it through a vector database, and serves it via RESTful endpoints.

### Key Capabilities

- 🤖 **RAG-powered AI Chat** using Google Gemini Pro
- 📊 **Real-time Data Fetching** from NewsAPI and data.gov.in
- 🔄 **Automated Scheduling** with intelligent caching (6-hour intervals)
- 🗄️ **Vector Database** with ChromaDB Cloud for semantic search
- 📈 **Dynamic Statistics** and filtering
- 🔍 **Semantic Search** across 50-150 infrastructure updates

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Track India Backend                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Data Sources    │         │  Processing      │         │  Storage         │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • NewsAPI        │────────▶│ Data Fetcher     │────────▶│ JSON Cache       │
│ • data.gov.in    │         │ • Scheduler      │         │ • fetched_data   │
│ • Catalog Search │         │ • Parser         │         │ • timestamps     │
└──────────────────┘         │ • Transformer    │         └──────────────────┘
                             └──────────────────┘                  │
                                      │                            │
                                      ▼                            ▼
                             ┌──────────────────┐         ┌──────────────────┐
                             │ Vector Database  │         │  API Endpoints   │
                             ├──────────────────┤         ├──────────────────┤
                             │ • ChromaDB Cloud │◀────────│ Flask REST API   │
                             │ • 384-dim        │         │ • /api/updates   │
                             │ • Embeddings     │         │ • /api/stats     │
                             │ • Semantic Search│         │ • /api/chat      │
                             └──────────────────┘         └──────────────────┘
                                      │                            │
                                      └────────────────────────────┘
                                                   │
                                                   ▼
                                      ┌──────────────────────┐
                                      │   RAG + Gemini AI    │
                                      ├──────────────────────┤
                                      │ • Context Retrieval  │
                                      │ • AI Generation      │
                                      │ • Source Citations   │
                                      └──────────────────────┘
```

### Data Flow Diagram

```
[External APIs] → [APScheduler] → [Data Fetcher] → [JSON Storage]
                                         ↓
                                  [Vector DB Builder]
                                         ↓
                                  [ChromaDB Cloud]
                                         ↓
                    ┌────────────────────┴────────────────────┐
                    ▼                                          ▼
            [REST Endpoints]                           [RAG Query System]
                    ↓                                          ↓
            [Frontend Client]                          [Gemini Pro AI]
```

---

## ✨ Features

### 🔄 Automated Data Fetching

- **Smart Scheduling**: Runs every 6 hours with intelligent cache checking
- **Multiple Sources**:
  - NewsAPI.org (50 articles per fetch)
  - data.gov.in Catalog Search API
- **Cache Management**: Only fetches when data is >6 hours old
- **Auto-Update Vector DB**: Automatically rebuilds embeddings after fetch

### 🤖 RAG-Powered AI Chat

- **Semantic Search**: Retrieves relevant context from vector database
- **AI Generation**: Google Gemini Pro for natural language responses
- **Source Citations**: Returns 5 most relevant sources with each answer
- **Context-Aware**: Uses 384-dimensional embeddings for accurate retrieval

### 📊 Dynamic API Endpoints

1. **GET /api/updates** - List all updates with filtering
   - Parameters: `type` (all/news/project), `limit` (default: 20)
   - Returns: Paginated list with total count
2. **GET /api/updates/<id>** - Single update with related items
   - Returns: Full details + 5 related updates
3. **GET /api/stats** - Real-time statistics
   - Active projects, total funding, new policies, completed projects
4. **POST /api/chat** - AI-powered chat interface
   - Input: User question
   - Output: AI answer + source citations

### 🗄️ Vector Database

- **ChromaDB Cloud**: Distributed vector storage
- **Sentence Transformers**: all-MiniLM-L6-v2 model
- **384 Dimensions**: Compact yet accurate embeddings
- **50-150 Records**: Automatically maintained
- **Semantic Search**: k=5 nearest neighbors

---

## 🛠️ Tech Stack

| Component           | Technology            | Version | Purpose                   |
| ------------------- | --------------------- | ------- | ------------------------- |
| **Web Framework**   | Flask                 | 3.0.0   | REST API server           |
| **CORS**            | Flask-CORS            | 4.0.0   | Cross-origin requests     |
| **Scheduler**       | APScheduler           | 3.11.0  | Automated data fetching   |
| **Vector DB**       | ChromaDB              | 0.5.0+  | Semantic search & storage |
| **Embeddings**      | Sentence Transformers | 2.3.0+  | Text-to-vector conversion |
| **AI Model**        | Google Generative AI  | 0.8.5   | Gemini Pro chat           |
| **ML Framework**    | PyTorch               | 2.2.0+  | Neural network backend    |
| **Data Processing** | Pandas                | 2.1.3   | Data manipulation         |
| **HTTP Client**     | Requests              | 2.31.0  | API calls                 |
| **Environment**     | Python-dotenv         | 1.0.0   | Configuration management  |

---

## 📁 Project Structure

```
python/
├── app.py                      # Main Flask application
├── data_fetcher.py             # Automated data fetching system
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (not in git)
├── example.config.env          # Example configuration
├── README.md                   # This file
│
├── data/                       # Cached data storage
│   └── fetched_data.json      # Latest fetched articles (50-150 records)
│
├── rag/                        # RAG system modules
│   ├── __init__.py
│   ├── build_vector_db.py     # Vector database builder
│   └── query_rag.py           # RAG query system with Gemini
│
└── venv/                       # Virtual environment (not in git)
```

### Key Files

- **`app.py`**: Main Flask server with all REST endpoints and initialization logic
- **`data_fetcher.py`**: Handles automatic data fetching from NewsAPI and data.gov.in
- **`rag/build_vector_db.py`**: Builds and maintains ChromaDB vector database
- **`rag/query_rag.py`**: RAG system for semantic search + AI generation
- **`data/fetched_data.json`**: JSON cache with timestamp for intelligent refreshing

---

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Step 1: Clone Repository

```bash
cd Track-India-Null-Coders/python
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
# Copy example config
cp example.config.env .env

# Edit .env with your API keys
notepad .env  # Windows
nano .env     # Linux/Mac
```

---

## ⚙️ Configuration

Create a `.env` file in the `python/` directory:

```env
# NewsAPI.org - Free tier (100 requests/day)
# Sign up at: https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# data.gov.in API Key
# Get from: https://data.gov.in/
API_KEY=your_datagovin_key_here

# Google Gemini API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_key_here

# ChromaDB Cloud API Key
# Get from: https://trychroma.com/
CHROMA_API=your_chroma_key_here
```

### API Key Setup

1. **NewsAPI** (Free):

   - Visit: https://newsapi.org/register
   - Free tier: 100 requests/day
   - Used for: Indian infrastructure news

2. **data.gov.in** (Free):

   - Visit: https://data.gov.in/
   - Register and request API access
   - Used for: Government catalog search

3. **Google Gemini** (Free):

   - Visit: https://makersuite.google.com/app/apikey
   - Free tier available
   - Used for: AI chat responses

4. **ChromaDB Cloud** (Free tier available):
   - Visit: https://trychroma.com/
   - Used for: Vector database storage

---

## 📡 API Documentation

### Base URL

```
http://localhost:8010/api
```

### Endpoints

#### 1. Health Check

```http
GET /
```

**Response:**

```json
{
  "status": "running",
  "message": "Track India API Server",
  "version": "1.0",
  "endpoints": ["/api/updates", "/api/stats", "/api/chat"],
  "data_source": "Real API (data.gov.in + NewsAPI)",
  "scheduler": "Active (6-hour intervals)"
}
```

---

#### 2. Get Updates List

```http
GET /api/updates?type=all&limit=20
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `all` | Filter type: `all`, `news`, `project` |
| `limit` | integer | `20` | Number of results to return |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "news_0_1761406063",
      "title": "New Metro Line Approved for Mumbai",
      "description": "Government approves 33km metro extension...",
      "category": "news",
      "source": "NewsAPI",
      "published": "2025-01-20T10:30:00Z",
      "url": "https://example.com/article",
      "impact_score": 85
    }
  ],
  "total": 50,
  "filtered": 20,
  "type": "all",
  "limit": 20
}
```

---

#### 3. Get Single Update

```http
GET /api/updates/<id>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique update ID (e.g., `news_0_1761406063`) |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "news_0_1761406063",
    "title": "New Metro Line Approved for Mumbai",
    "description": "Full description...",
    "category": "news",
    "source": "NewsAPI",
    "published": "2025-01-20T10:30:00Z",
    "url": "https://example.com/article",
    "impact_score": 85,
    "metadata": {
      "author": "PTI",
      "tags": ["transport", "mumbai", "metro"]
    }
  },
  "related": [
    {
      "id": "news_1_1761406063",
      "title": "Delhi Metro Phase 4 Update",
      "similarity": 0.87
    }
  ]
}
```

---

#### 4. Get Statistics

```http
GET /api/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "active_projects": 247,
    "total_funding": "₹45,000 Cr",
    "new_policies": 12,
    "completed": 89
  },
  "calculated_from": "real_data",
  "last_updated": "2025-01-20T15:45:00Z"
}
```

---

#### 5. AI Chat (RAG)

```http
POST /api/chat
Content-Type: application/json
```

**Request Body:**

```json
{
  "message": "What are the latest infrastructure projects in Maharashtra?"
}
```

**Response:**

```json
{
  "success": true,
  "answer": "Based on recent data, Maharashtra has several major infrastructure projects...",
  "sources": [
    {
      "id": "news_0_1761406063",
      "title": "Mumbai Metro Extension Approved",
      "url": "https://example.com/article",
      "relevance": 0.92
    }
  ],
  "model": "Gemini Pro",
  "retrieved_contexts": 5
}
```

---

## 🔄 Data Pipeline

### Automated Fetching Process

```python
# APScheduler Configuration
Interval: Every 6 hours
Trigger: Cron-style with cache checking
Cache Duration: 6 hours minimum
```

### Fetch Workflow

1. **Check Cache Age**

   ```python
   if cache_age < 6 hours:
       skip_fetch()
   ```

2. **Fetch from NewsAPI**

   - Query: Indian infrastructure, government, policy news
   - Limit: 50 articles
   - Sort: Latest first

3. **Fetch from data.gov.in**

   - Catalog search API
   - Topics: Infrastructure, education, health, water

4. **Process & Store**

   - Clean and normalize data
   - Add unique IDs and timestamps
   - Save to `data/fetched_data.json`

5. **Update Vector DB**
   - Generate 384-dim embeddings
   - Upsert to ChromaDB Cloud
   - Update metadata

### Data Structure

```json
{
  "last_updated": "2025-01-20T15:45:00Z",
  "total_records": 50,
  "updates": [
    {
      "id": "news_0_1761406063",
      "title": "Article Title",
      "description": "Full description...",
      "category": "news",
      "source": "NewsAPI",
      "published": "2025-01-20T10:30:00Z",
      "url": "https://...",
      "impact_score": 85
    }
  ]
}
```

---

## 🧠 RAG System

### Architecture

```
User Query → Embedding Model → Vector Search → Context Retrieval
                                                        ↓
User Question + Retrieved Context → Gemini Pro → AI Answer + Sources
```

### Components

#### 1. Vector Database Builder (`build_vector_db.py`)

- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Dimensions**: 384
- **Storage**: ChromaDB Cloud
- **Collection**: `indian_infrastructure_data`

#### 2. RAG Query System (`query_rag.py`)

- **Retrieval**: k=5 nearest neighbors
- **Context**: Top 5 most relevant documents
- **Generation**: Google Gemini Pro
- **Output**: Answer + source citations

### Usage Example

```python
from rag.query_rag import initialize_rag, get_rag_query

# Initialize RAG system
initialize_rag()

# Query
rag_query = get_rag_query()
result = rag_query.query("What are the water projects in Karnataka?")

# Result
print(result['answer'])      # AI-generated answer
print(result['sources'])     # List of source documents
```

---

## 💻 Development

### Running the Server

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Run Flask app
python app.py
```

**Output:**

```
============================================================
🚀 INITIALIZING TRACK INDIA SYSTEM
============================================================

1️⃣ Starting data fetcher (6-hour schedule)...
   ✅ Scheduler started
   ⏰ Next run: 2025-01-20 21:45:00

2️⃣ Building vector database...
   📥 Loading embedding model...
   ✅ Model loaded: all-MiniLM-L6-v2 (384 dimensions)
   📂 Found existing data file
   ✅ Vector database ready: 150 records

3️⃣ Initializing RAG query system...
   ✅ RAG system initialized

============================================================
✅ SYSTEM READY
============================================================
   Server: http://localhost:8010
   Data Sources: data.gov.in + NewsAPI
   AI: Gemini Pro with RAG
   Vector DB: 150 records
   Scheduler: Active
============================================================

 * Running on http://127.0.0.1:8010
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8010/

# Get updates
curl http://localhost:8010/api/updates?type=all&limit=5

# Get single update
curl http://localhost:8010/api/updates/news_0_1761406063

# Get stats
curl http://localhost:8010/api/stats

# Test chat (PowerShell)
$body = @{ message = "Latest projects?" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8010/api/chat -Method Post -Body $body -ContentType "application/json"
```

### Manual Data Fetch

```bash
# Force immediate data fetch
python -c "from data_fetcher import fetcher; fetcher.fetch_all_data()"
```

### Rebuild Vector Database

```bash
# Rebuild from cached data
python -c "from rag.build_vector_db import get_builder; get_builder().build_from_file('data/fetched_data.json')"
```

---

## 📊 Performance Metrics

| Metric               | Value          |
| -------------------- | -------------- |
| Startup Time         | ~15-20 seconds |
| API Response Time    | <100ms (avg)   |
| Vector Search Time   | <50ms          |
| AI Generation Time   | 2-5 seconds    |
| Data Fetch Interval  | 6 hours        |
| Records Stored       | 50-150         |
| Embedding Dimensions | 384            |

---

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Change port in app.py
   app.run(host='0.0.0.0', port=8011, debug=False)
   ```

2. **API Key Errors**

   - Check `.env` file exists
   - Verify API keys are valid
   - Check API rate limits

3. **Vector DB Connection Issues**

   - Verify ChromaDB API key
   - Check internet connection
   - Ensure tenant ID is correct

4. **Import Errors**
   - Reinstall dependencies: `pip install -r requirements.txt --upgrade`
   - Check Python version: `python --version` (3.8+)

---

## 🔐 Security Notes

- Never commit `.env` file to git
- Rotate API keys regularly
- Use environment variables for all secrets
- Enable CORS only for trusted domains in production
- Implement rate limiting for production use

---

## 📈 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Caching layer (Redis)
- [ ] Authentication & authorization
- [ ] Rate limiting per API key
- [ ] WebSocket support for real-time updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Export API (CSV, PDF)

---

## 👥 Team

**Null Coders**  
Track India Hackathon Project • 2025

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact: team@nullcoders.dev

---

**Built with ❤️ for India's Development Tracking**
