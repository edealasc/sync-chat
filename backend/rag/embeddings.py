import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions

def create_embeddings_from_csv(csv_data, collection_name="rag_collection", persist_path="chromadb_data"):
    # Read CSV data from string
    from io import StringIO
    df = pd.read_csv(StringIO(csv_data))
    texts = df['text'].tolist()

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

    # Add documents to ChromaDB if collection is empty
    if collection.count() == 0:
        collection.add(
            documents=texts,
            ids=[str(i) for i in range(len(texts))]
        )
    return collection