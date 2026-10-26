# Multi-stage production container for WarrantyVault
FROM python:3.11-slim as backend

WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

COPY . .

EXPOSE 8000
EXPOSE 3000

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "python -m http.server 3000 & uvicorn backend.server:app --host 0.0.0.0 --port 8000"]
