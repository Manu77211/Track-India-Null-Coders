import os
import json
import chromadb
from sentence_transformers import SentenceTransformer
import time

# Chroma Cloud API key from .env
from dotenv import load_dotenv
load_dotenv()
chroma_api_key = os.getenv("CHROMA_API")

if not chroma_api_key:
    raise ValueError("❌ Please set CHROMA_API in .env")

# Initialize Hugging Face model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Chroma Cloud client
client = chromadb.CloudClient(
    api_key=chroma_api_key,
    tenant="2a5e9e54-7155-4ae8-b0f1-3bde91b5ecf0",
    database="rag_db"
)

# Load combined JSON
data_path = "../data/data.json"
with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

def flatten_json(record):
    return " | ".join(f"{k}: {v}" for k, v in record.items())

texts = [flatten_json(r) for r in data]
ids = [str(i) for i in range(len(texts))]
metadatas = [{"source": "combined_data"} for _ in texts]

# Create Chroma collection
collection = client.get_or_create_collection(name="combined_data")

# Generate embeddings and add to Chroma
for i, text in enumerate(texts):
    vector = model.encode(text).tolist()  # Hugging Face embedding

    collection.add(
        documents=[text],
        metadatas=[metadatas[i]],
        ids=[ids[i]],
        embeddings=[vector]
    )

    # Pause every 50 records to avoid overload
    if i % 50 == 0:
        time.sleep(0.5)

print(f"✅ Vector DB built for combined_data with {len(texts)} records")
