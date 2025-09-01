```mermaid
flowchart LR
  UI[Frontend UI] --> C[Controller]
  C --> S[Service]
  S --> R[Repository]
  R --> DB[(PostgreSQL)]
  DB --> R
  R --> S
  S --> C
```
