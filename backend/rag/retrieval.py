def retrieve(collection, query, top_k=5):
    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    return results['documents'][0]