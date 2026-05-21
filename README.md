Git clone:
git clone https://github.com/jalUNStrict/Project-RSI/tree/main

Run backend:
python -m uvicorn src.app:app --reload --port 8001
or
poetry run fastapi dev src/app.py

Run frontend:
npm install
npm run dev
