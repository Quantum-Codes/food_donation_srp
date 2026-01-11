# 🍽️ Food Donation Platform - Backend API

A FastAPI backend for the Food Donation Platform, using Supabase as the database.

## 📋 Features

- **Authentication**: JWT-based auth with registration, login, logout
- **Donations**: Create, view, and manage food donations
- **NGO Management**: Admin functions for managing partner NGOs
- **Leaderboard**:  Gamification with points and rankings
- **Admin Dashboard**: Platform statistics and activity monitoring

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.9+)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt via passlib

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main. py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Supabase client setup
│   ├── auth/                # Authentication module
│   │   ├── router.py        # Auth endpoints
│   │   ├── service.py       # Auth business logic
│   │   └── dependencies.py  # Auth dependencies (JWT validation)
│   ├── donations/           # Donations module
│   │   ├── router.py        # Donation endpoints
│   │   └── service.py       # Donation business logic
│   ├── ngos/                # NGO management module
│   │   ├── router.py        # NGO endpoints
│   │   └── service.py       # NGO business logic
│   ├── leaderboard/         # Leaderboard module
│   │   ├── router.py        # Leaderboard endpoints
│   │   └── service.py       # Leaderboard business logic
│   ├── admin/               # Admin module
│   │   ├── router.py        # Admin endpoints
│   │   └── service.py       # Admin business logic
│   └── models/
│       └── schemas.py       # Pydantic models/schemas
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── requirements.txt         # Python dependencies
├── . env. example            # Environment variables template
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- A Supabase account and project
- pip or pipenv for package management

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)

2. Go to **Project Settings** → **API** and copy: 
   - Project URL
   - `anon` public key
   - `service_role` secret key

3. Go to **SQL Editor** and run the migration script:
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run in SQL Editor

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application
APP_NAME=Food Donation API
DEBUG=True
```

⚠️ **Important**: Generate a secure JWT secret key: 
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: 
- **API**:  http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/me` | Update profile | Yes |

### Donation Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/donations` | Create donation | Yes | Donor |
| GET | `/api/donations` | List donations | Yes | All |
| GET | `/api/donations/{id}` | Get donation details | Yes | All |
| GET | `/api/donations/map` | Get donations for map | Yes | Staff/Admin |
| PATCH | `/api/donations/{id}/status` | Update status | Yes | Staff |

### NGO Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ngos` | List all NGOs |
| POST | `/api/ngos` | Create new NGO |
| GET | `/api/ngos/{id}` | Get NGO details |
| PUT | `/api/ngos/{id}` | Update NGO |
| DELETE | `/api/ngos/{id}` | Delete NGO |

### Leaderboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leaderboard` | Get donor rankings | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/admin/stats` | Platform statistics | Yes | Admin |
| GET | `/api/admin/activity` | Activity log | Yes | Admin |
| GET | `/api/admin/users/me/stats` | User stats | Yes | Donor |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. 

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "full_name": "John Doe",
    "password":  "SecurePass123",
    "role": "donor"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "SecurePass123"
  }'
```

### Using the Token

Include the token in the Authorization header: 

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer your-jwt-token"
```

## 🧪 Testing the API

### Using Swagger UI

1. Open http://localhost:8000/docs
2. Click "Authorize" button
3. Enter your JWT token (without "Bearer" prefix)
4. Test endpoints directly in the browser

### Default Admin Account

After running migrations, a default admin is created:
- **Email**: admin@fooddonation.org
- **Password**: Admin123! 

## 🔧 Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_KEY` | Supabase anon key | Required |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Required |
| `JWT_SECRET_KEY` | Secret for JWT signing | Required |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry time | 1440 (24h) |
| `APP_NAME` | Application name | Food Donation API |
| `DEBUG` | Debug mode | False |

## 🚀 Deployment

### Using Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

COPY . . 

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run: 

```bash
docker build -t food-donation-api .
docker run -p 8000:8000 --env-file .env food-donation-api
```

### Production Considerations

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Secrets**: Use environment variables or secret management
3. **CORS**: Restrict CORS origins to your frontend domain
4. **Rate Limiting**: Add rate limiting for production
5. **Logging**: Configure proper logging
6. **Monitoring**: Set up health checks and monitoring

## 📝 License

This project is part of the Food Donation SRP project. 

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request