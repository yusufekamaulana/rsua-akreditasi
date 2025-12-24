FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /src/app

# System deps for LightGBM (libgomp) and friends
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
 && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Pre-download MiniLM embedding model into the image
RUN python - << "EOF"
from sentence_transformers import SentenceTransformer
SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
EOF

# Copy application code
COPY . .    

CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
