"""
RAG Query Module - Query vector DB and generate responses with Gemini AI
"""
import os
import json
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class RAGQuery:
    def __init__(self, collection):
        """
        Initialize RAG query system
        
        Args:
            collection: ChromaDB collection instance
        """
        self.collection = collection
        
        # Load embedding model
        print("📥 Loading embedding model for queries...")
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        
        # Configure Gemini API
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not self.gemini_api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in .env")
        
        genai.configure(api_key=self.gemini_api_key)
        self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        print("✅ RAG Query system initialized")
    
    def search_vector_db(self, query, top_k=5):
        """
        Search vector DB for relevant documents
        
        Args:
            query: User query string
            top_k: Number of results to return
            
        Returns:
            List of relevant documents with metadata
        """
        try:
            # Generate query embedding
            query_embedding = self.model.encode(query).tolist()
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            
            # Format results
            documents = []
            if results and 'documents' in results:
                for i in range(len(results['documents'][0])):
                    doc = {
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i] if 'metadatas' in results else {},
                        'distance': results['distances'][0][i] if 'distances' in results else None
                    }
                    documents.append(doc)
            
            return documents
            
        except Exception as e:
            print(f"❌ Error searching vector DB: {e}")
            return []
    
    def generate_response(self, query, context_docs):
        """
        Generate AI response using Gemini with retrieved context
        
        Args:
            query: User query
            context_docs: Retrieved documents from vector DB
            
        Returns:
            AI-generated response
        """
        try:
            # Build context from retrieved documents
            context = "\n\n".join([
                f"Document {i+1}:\n{doc['content']}"
                for i, doc in enumerate(context_docs)
            ])
            
            # Create prompt for Gemini
            prompt = f"""You are an AI assistant helping users understand Indian government policies, infrastructure projects, and development initiatives.

Use the following context from official sources to answer the user's question. If the context doesn't contain enough information, say so and provide general knowledge if appropriate.

Context:
{context}

User Question: {query}

Please provide a clear, accurate, and helpful response based on the context above. Include specific details like ministries, locations, dates, and funding amounts when available."""
            
            # Generate response with Gemini
            response = self.gemini_model.generate_content(prompt)
            
            return response.text
            
        except Exception as e:
            print(f"❌ Error generating Gemini response: {e}")
            return f"I apologize, but I encountered an error generating a response: {str(e)}"
    
    def query(self, user_query, top_k=5, return_sources=True):
        """
        Complete RAG query pipeline
        
        Args:
            user_query: User's question
            top_k: Number of documents to retrieve
            return_sources: Whether to include source documents in response
            
        Returns:
            Dictionary with response and optional source documents
        """
        print(f"\n🔍 Processing query: {user_query}")
        
        # Step 1: Search vector DB
        print(f"   Searching vector DB (top {top_k} results)...")
        documents = self.search_vector_db(user_query, top_k=top_k)
        
        if not documents:
            return {
                'response': "I couldn't find relevant information in the database. Please try rephrasing your question or ask about Indian government policies, infrastructure, or development projects.",
                'sources': []
            }
        
        print(f"   ✅ Found {len(documents)} relevant documents")
        
        # Step 2: Generate response with Gemini
        print("   Generating AI response with Gemini...")
        response_text = self.generate_response(user_query, documents)
        print("   ✅ Response generated")
        
        # Format response
        result = {
            'response': response_text,
            'query': user_query
        }
        
        if return_sources:
            # Extract source information
            sources = []
            for doc in documents:
                metadata = doc.get('metadata', {})
                source = {
                    'title': metadata.get('title', 'Unknown'),
                    'type': metadata.get('type', 'unknown'),
                    'ministry': metadata.get('ministry', 'Unknown'),
                    'date': metadata.get('date', ''),
                    'source': metadata.get('source', 'Unknown'),
                    'relevance': 1 - (doc.get('distance', 1) if doc.get('distance') else 1)  # Convert distance to relevance score
                }
                sources.append(source)
            
            result['sources'] = sources
            result['source_count'] = len(sources)
        
        return result

# Global instance will be initialized by app.py
_rag_query = None

def initialize_rag(collection):
    """Initialize RAG query system with ChromaDB collection"""
    global _rag_query
    try:
        _rag_query = RAGQuery(collection)
        return _rag_query
    except Exception as e:
        print(f"❌ Failed to initialize RAG: {e}")
        return None

def get_rag_query():
    """Get RAG query instance"""
    return _rag_query

if __name__ == "__main__":
    # Test script
    print("RAG Query Module - Test")
    print("This module should be used through app.py")
    print("\nRequired:")
    print("1. GEMINI_API_KEY in .env")
    print("2. ChromaDB collection initialized")
    print("3. Vector DB populated with data")
