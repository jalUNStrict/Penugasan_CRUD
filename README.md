1. Git clone:

git clone https://github.com/jalUNStrict/Project-RSI/tree/main

2. Run backend:
python -m uvicorn src.app:app --reload --port 8001
or
poetry run fastapi dev src/app.py

3. Run frontend:

npm install

npm run dev
