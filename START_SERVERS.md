# 🚀 How to Start Track India Servers

## Quick Start Guide

You need to run **2 servers** simultaneously:

1. **Flask Backend** (Python) - Port 8010
2. **Next.js Frontend** (Node) - Port 3000

---

## Option 1: Using 2 Terminals (Recommended)

### Terminal 1 - Flask Backend

```powershell
cd python
python app.py
```

**Keep this terminal running!** You should see:

```
✅ SYSTEM INITIALIZED SUCCESSFULLY
* Running on http://127.0.0.1:8010
```

### Terminal 2 - Next.js Frontend

```powershell
npm run dev
```

**Keep this terminal running too!** You should see:

```
ready - started server on 0.0.0.0:3000
```

---

## Option 2: Using PowerShell Script

Create a file `start.ps1`:

```powershell
# Start Flask in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python; python app.py"

# Wait 5 seconds for Flask to start
Start-Sleep -Seconds 5

# Start Next.js in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "✅ Both servers starting..."
Write-Host "   Flask: http://localhost:8010"
Write-Host "   Next.js: http://localhost:3000"
```

Then run:

```powershell
.\start.ps1
```

---

## Verify Servers Are Running

### Test Flask Backend:

Open browser: `http://localhost:8010/api/updates?type=all&limit=5`

You should see JSON data with 50 articles.

### Test Next.js Frontend:

Open browser: `http://localhost:3000/updates`

You should see the Live Updates page with data!

---

## Common Issues

### "Unable to connect to server"

- ❌ Flask backend is not running
- ✅ Start Flask in Terminal 1 (see above)

### "Port 8010 already in use"

- Close other Flask processes:

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process
```

### "Port 3000 already in use"

- Close other Next.js processes:

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process
```

---

## Stop Servers

Press `Ctrl+C` in each terminal window to stop the servers gracefully.

---

## What Each Server Does

### Flask Backend (Port 8010)

- Fetches data from NewsAPI & data.gov.in every 6 hours
- Manages Vector Database (ChromaDB)
- Provides API endpoints:
  - `/api/updates` - Latest government updates
  - `/api/stats` - Statistics
  - `/api/chat` - RAG + Gemini AI chat

### Next.js Frontend (Port 3000)

- Displays Live Updates page
- Chat with India interface
- Dashboard with charts and maps
- Polls backend every 30 seconds for updates

---

## Expected Output

When everything is running correctly:

**Flask Terminal:**

```
🚀 Starting Track India API Server...
📂 Using cached data from 0h 5m ago
✅ Vector DB built successfully! Total records: 50
✅ SYSTEM INITIALIZED SUCCESSFULLY

127.0.0.1 - - [25/Oct/2025 21:00:00] "GET /api/updates HTTP/1.1" 200 -
127.0.0.1 - - [25/Oct/2025 21:00:05] "GET /api/stats HTTP/1.1" 200 -
```

**Next.js Terminal:**

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Browser (localhost:3000/updates):**

- ✅ Green "Live" indicator
- ✅ Stats cards showing numbers (50 active projects, etc.)
- ✅ Grid of 50 article cards
- ✅ Auto-refresh toggle working

---

**Now open: `http://localhost:3000/updates`** 🎉
