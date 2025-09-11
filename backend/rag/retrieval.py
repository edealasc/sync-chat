import os
import re
import json
from google.generativeai import GenerativeModel, configure
from dotenv import load_dotenv

load_dotenv()

def generate_multi_queries(query, n=3):
    """
    Use Gemini to generate multiple reformulations of the user's query.
    """
    configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = GenerativeModel("gemini-2.0-flash")
    prompt = f"""
Given the following user query, generate {n} diverse, relevant reformulations (paraphrases or clarifications) that could help retrieve more comprehensive information from a knowledge base. 
Return the queries as a JSON array.

User query: "{query}"
Output format:
[
  "reformulation 1",
  "reformulation 2",
  "reformulation 3"
]
"""
    response = gemini_model.generate_content(prompt)
    raw_text = response.text.strip()

    # Extract JSON array from code block if present
    code_block = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw_text)
    if code_block:
        json_str = code_block.group(1)
    else:
        json_str = raw_text
    try:
        queries = json.loads(json_str)
        if isinstance(queries, list):
            return queries
    except Exception:
        pass
    # Fallback: return the original query as a single-item list
    return [query]

def retrieve(collection, query, top_k=5, multi_query_n=3):
    # Generate multiple queries using Gemini
    queries = generate_multi_queries(query, n=multi_query_n)

    # Retrieve documents for each query
    all_docs = []
    for q in queries:
        results = collection.query(
            query_texts=[q],
            n_results=top_k
        )
        docs = results.get('documents', [[]])[0]
        all_docs.extend(docs)

    # Deduplicate while preserving order
    seen = set()
    deduped_docs = []
    for doc in all_docs:
        if doc not in seen:
            deduped_docs.append(doc)
            seen.add(doc)

    return deduped_docs

# if __name__ == "__main__":
#     # Mock collection with a .query() method
#     class MockCollection:
#         def query(self, query_texts, n_results=5):
#             # Return mock documents for each query
#             return {
#                 'documents': [[f"Mock doc for: {qt}" for qt in query_texts]]
#             }

#     # Example user query
#     user_query = "What books does your company sell?"

#     # Instantiate mock collection
#     collection = MockCollection()

#     # Generate multi-queries
#     queries = generate_multi_queries(user_query, n=2)
#     print("Generated queries:")
#     for q in queries:
#         print(q)

#     # Call retrieve with mock data
#     results = retrieve(collection, user_query, top_k=2, multi_query_n=2)

#     print("\nRetrieved documents:")
#     for doc in results:
#         print(doc)