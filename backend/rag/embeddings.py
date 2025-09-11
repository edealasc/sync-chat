import pandas as pd
import chromadb
from chromadb.utils import embedding_functions
from transformers import AutoTokenizer
import nltk
from nltk.tokenize import sent_tokenize
from functools import lru_cache
from io import StringIO
import math

# -------------------------------
# Centralized tokenizer
# -------------------------------
# Make sure this tokenizer is imported in other modules instead of initializing again
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

# -------------------------------
# NLTK sentence tokenizer
# -------------------------------
nltk.download('punkt')

# -------------------------------
# Token counting with caching
# -------------------------------
@lru_cache(maxsize=100000)
def count_tokens(text):
    return len(tokenizer.encode(text, add_special_tokens=False))

# -------------------------------
# Sliding-window chunking
# -------------------------------
def chunk_text(text, max_tokens=400, overlap_tokens=80):
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_len = 0

    for sentence in sentences:
        sentence_len = count_tokens(sentence)
        if current_len + sentence_len > max_tokens:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
            # Start new chunk with overlap
            overlap_chunk = []
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
# Create embeddings from CSV with incremental & batched add
# -------------------------------
def create_embeddings_from_csv(csv_data, collection_name="rag_collection", persist_path="chromadb_data", batch_size=500):
    # Read CSV data from string
    df = pd.read_csv(StringIO(csv_data))

    # Initialize ChromaDB embedding function
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )

    # Initialize ChromaDB PersistentClient
    chroma_client = chromadb.PersistentClient(path=persist_path)

    # Create or get the collection
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=sentence_transformer_ef
    )

    # Prepare chunks and metadata
    all_texts, all_metadatas, all_ids = [], [], []

    for idx, row in df.iterrows():
        text = row['text']
        url = row.get('url', '')
        section_title = row.get('section_title', '')
        doc_id = str(idx)

        chunks = chunk_text(text, max_tokens=400, overlap_tokens=80)
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}_{i}"
            # Skip if this chunk already exists in collection
            if collection.get(ids=[chunk_id])['ids']:
                continue
            all_texts.append(chunk)
            all_metadatas.append({
                'doc_id': doc_id,
                'section_title': section_title,
                'url': url,
                'chunk_index': i
            })
            all_ids.append(chunk_id)

            # Batch add to collection
            if len(all_texts) >= batch_size:
                collection.add(documents=all_texts, metadatas=all_metadatas, ids=all_ids)
                all_texts, all_metadatas, all_ids = [], [], []

    # Add remaining chunks
    if all_texts:
        collection.add(documents=all_texts, metadatas=all_metadatas, ids=all_ids)

    return collection
