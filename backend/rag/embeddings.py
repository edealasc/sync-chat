import pandas as pd
from chromadb.utils import embedding_functions
import chromadb
from transformers import AutoTokenizer
import nltk
from nltk.tokenize import sent_tokenize
from functools import lru_cache
from io import StringIO
from typing import List, Dict, Optional

# -------------------------------
# NLTK setup
# -------------------------------
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# -------------------------------
# Centralized tokenizer
# -------------------------------
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

# -------------------------------
# Token counting with caching
# -------------------------------
@lru_cache(maxsize=100000)
def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text, add_special_tokens=False))

# -------------------------------
# Sliding-window chunking
# -------------------------------
def chunk_text(text: str, max_tokens: int = 400, overlap_tokens: int = 80) -> List[str]:
    sentences = sent_tokenize(text)
    chunks: List[str] = []
    current_chunk: List[str] = []
    current_len = 0

    for sentence in sentences:
        sentence_len = count_tokens(sentence)
        if current_len + sentence_len > max_tokens:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
            # Create overlap for next chunk
            overlap_chunk: List[str] = []
            overlap_len = 0
            if overlap_tokens > 0:
                for s in reversed(current_chunk):
                    l = count_tokens(s)
                    if overlap_len + l <= overlap_tokens:
                        overlap_chunk.insert(0, s)
                        overlap_len += l
                    else:
                        break
            current_chunk = overlap_chunk
            current_len = sum(count_tokens(s) for s in current_chunk)
        current_chunk.append(sentence)
        current_len += sentence_len

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks

# -------------------------------
# Create embeddings from CSV data
# -------------------------------
def create_embeddings_from_csv(
    csv_data: str,
    collection_name: str = "rag_collection",
    persist_path: str = "chromadb_data",
    batch_size: int = 500
) -> chromadb.api.models.Collection.Collection:
    df = pd.read_csv(StringIO(csv_data))

    # Initialize ChromaDB embedding function
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

    # Initialize ChromaDB PersistentClient
    chroma_client = chromadb.PersistentClient(path=persist_path)

    # Get or create collection
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=sentence_transformer_ef
    )

    all_texts: List[str] = []
    all_metadatas: List[Dict] = []
    all_ids: List[str] = []

    for idx, row in df.iterrows():
        text = str(row.get('text', ''))
        url = str(row.get('url', ''))
        section_title = str(row.get('section_title', ''))
        doc_id = str(idx)

        chunks = chunk_text(text, max_tokens=400, overlap_tokens=80)
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}_{i}"

            # Batch add
            all_texts.append(chunk)
            all_metadatas.append({
                'doc_id': doc_id,
                'section_title': section_title,
                'url': url,
                'chunk_index': i
            })
            all_ids.append(chunk_id)

            if len(all_texts) >= batch_size:
                collection.add(documents=all_texts, metadatas=all_metadatas, ids=all_ids)
                all_texts, all_metadatas, all_ids = [], [], []

    # Add remaining chunks
    if all_texts:
        collection.add(documents=all_texts, metadatas=all_metadatas, ids=all_ids)

    return collection
