# Food donation platform

## Running:

Go to supabase, create project, then run the file `backend/supabase/migrations/001_initial_schema.sql`
Then make a .env file based on .env.example

In one terminal: 
```bash
cd frontend
npm i 
run run dev
```

In another:
```bash
cd backend
python3 -m venv venv
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```