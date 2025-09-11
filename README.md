---
config:
  layout: dagre
---
flowchart TD
 subgraph subGraph0["Data Ingestion Pipeline"]
        D("Data Ingestion & Embedding")
        C["Website Crawler"]
        V[/"Vector Store"/]
  end
 subgraph subGraph1["User Query Process"]
        B["Multi-Query Query Translation"]
        A("User Query")
        E{"Is a good search query generated?"}
        F["RAG Pipeline"]
        G("HyDE: Generate Hypothetical Document")
  end
 subgraph subGraph2["RAG Pipeline"]
        I("LLM")
        J["Synthesize Final Response"]
  end
    Admin["Chatbot Creator"] --> Config["Provide Config: 
        - Website URL
        - Allowed Domains
        - Chatbot Name
        - Tone
        - Goals"]
    Config --> C
    C --> D
    D --> V
    User["End User"] --> A
    A --> B
    B -- Generate Queries --> E
    E -- Yes --> F
    E -- No --> G
    G -- Embed & Search --> V
    V -- Retrieved Docs --> F
    F -- Retrieve from Vector Store --> V & I
    V -- Relevant Documents --> F
    I --> J
    J --> K(("Response to User"))
     D:::ingestion
     C:::ingestion
     V:::ingestion
     B:::query
     A:::query
     E:::query
     F:::rag
     G:::query
     I:::rag
     J:::output
     Admin:::admin
     Config:::admin
     User:::query
     K:::output
    classDef admin fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    classDef ingestion fill:#bbdefb,stroke:#1e88e5,stroke-width:2px,color:#000
    classDef query fill:#ffe0b2,stroke:#fb8c00,stroke-width:2px,color:#000
    classDef rag fill:#c8e6c9,stroke:#43a047,stroke-width:2px,color:#000
    classDef output fill:#e1bee7,stroke:#8e24aa,stroke-width:2px,color:#000
    classDef user fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#000

