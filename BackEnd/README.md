# 🚑 Therma-Triage Backend API

A robust FastAPI-based heatwave emergency response system with WBGT calculation, AI-powered triage, and hospital resource management.

## 🎯 Features

### Core Functionality
- **WBGT Calculation**: Real-time Wet Bulb Globe Temperature calculation using OpenWeatherMap API
- **AI Triage Engine**: Intelligent symptom analysis with severity assessment and routing recommendations
- **Hospital Management**: Real-time bed availability tracking with divert status
- **Resource Mapping**: Live view of hospitals and cooling shelters with capacities
- **JWT Security**: Token-based authentication for protected endpoints

### API Endpoints

#### Public Endpoints
- `GET /` - API health check
- `POST /weather/wbgt` - Calculate heat stress index for a location
- `POST /triage/submit` - Submit symptoms for AI triage and routing
- `GET /map/resources` - Get all hospitals and shelters with live data

#### Authentication
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/me` - Get current user info

#### Protected Endpoints (Requires JWT)
- `POST /hospital/update` - Update hospital bed counts and divert status
- `GET /hospital/list` - Get detailed hospital list

## 📦 Project Structure

```
therma-backend/
├── main.py              # FastAPI application and endpoints
├── schemas.py           # Pydantic models for data validation
├── logic.py             # Business logic (WBGT, triage, routing)
├── database.py          # Database layer (in-memory & SQLite)
├── auth.py              # JWT authentication system
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Set Up Environment

```bash
# Navigate to project directory
cd therma-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Start with auto-reload (development)
uvicorn main:app --reload

# Or run directly
python main.py
```

The server will start at `http://127.0.0.1:8000`

### 3. Explore the API

Open your browser and go to:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 🔐 Authentication

### Demo Credentials

The system comes with pre-configured demo users:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `hospital_staff` | `staff123` | Hospital Staff |

### Using JWT Tokens

1. **Login** via `POST /auth/login` with credentials
2. **Copy** the returned `access_token`
3. **Click** "Authorize" in Swagger UI
4. **Enter** `Bearer <your_token>` in the authorization field
5. **Access** protected endpoints

## 📊 How It Works

### WBGT Calculation

The system calculates Wet Bulb Globe Temperature using:

```
WBGT = 0.7 × T_wet_bulb + 0.2 × T_globe + 0.1 × T_dry_bulb
```

**Heat Stress Levels**:
- **< 27°C**: Low risk - Normal activities
- **27-29°C**: Moderate - Take regular breaks
- **29-31°C**: High - Limit outdoor activities
- **31-32°C**: Very High - Avoid strenuous activities
- **> 32°C**: Extreme - Stay indoors

### AI Triage Engine

The triage system analyzes symptoms in four categories:

1. **Critical** (→ Emergency Room): confusion, unconsciousness, seizure
2. **Severe** (→ Hospital): high fever, chest pain, difficulty breathing
3. **Moderate** (→ Hospital/Shelter): dizziness, nausea, muscle cramps
4. **Mild** (→ Cooling Shelter): thirst, mild headache, fatigue

**Factors Considered**:
- Symptom severity and count
- Age risk (elderly 65+ and children ≤5)
- Environmental heat stress (WBGT level)
- Facility availability and distance

### Resource Routing

The system finds the nearest suitable facility based on:
- **Severity level**: Determines if hospital or shelter is needed
- **Bed availability**: Checks ICU/ER bed counts
- **Divert status**: Avoids hospitals on divert
- **Distance**: Uses Haversine formula for accurate geo-calculation

## 🧪 Testing with Swagger

### Example 1: Check Heat Stress

1. Go to `POST /weather/wbgt`
2. Click "Try it out"
3. Enter:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```
4. Execute and see WBGT calculation

### Example 2: Submit Triage

1. Go to `POST /triage/submit`
2. Click "Try it out"
3. Enter:
```json
{
  "symptoms": ["dizziness", "fever", "confusion"],
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "age": 45
}
```
4. Get severity, routing, and nearest facility

### Example 3: Update Hospital (Protected)

1. First, login via `POST /auth/login` with `admin`/`admin123`
2. Copy the access token
3. Click "Authorize" button (top right)
4. Enter: `Bearer your_token_here`
5. Go to `POST /hospital/update`
6. Enter:
```json
{
  "hospital_id": "hosp_001",
  "icu_beds": 15,
  "er_beds": 25,
  "is_diverting": false
}
```

## 🗄️ Database Options

### In-Memory (Default - For Development)

Fast, no persistence, resets on restart.

```python
# In database.py
db = InMemoryDatabase()
```

### SQLite (For Production)

Persists data, suitable for deployment.

```python
# In database.py
db = SQLDatabase()
```

## 🌐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
OPENWEATHER_API_KEY=your_api_key_here  # Optional
JWT_SECRET_KEY=change-this-secret-key
DATABASE_URL=sqlite:///./therma_triage.db
HOST=0.0.0.0
PORT=8000
```

## 🛠️ Development

### Running Tests

```bash
pytest
```

### Code Style

```bash
# Format code
black .

# Lint
flake8 .
```

## 📱 Frontend Integration

Enable CORS in `main.py` (already configured):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET_KEY` to a secure random value
- [ ] Set up real OpenWeatherMap API key
- [ ] Switch to `SQLDatabase()` in `database.py`
- [ ] Update CORS origins to specific domains
- [ ] Set up HTTPS/SSL
- [ ] Configure environment variables
- [ ] Set up monitoring and logging

### Deploy with Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Deploy with Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📚 API Documentation

Full interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

This is a hackathon/demo project. For production use:
1. Implement comprehensive testing
2. Add input validation
3. Set up proper database migrations
4. Implement rate limiting
5. Add monitoring and logging
6. Set up CI/CD pipeline

## 📄 License

MIT License - Feel free to use for your projects!

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- FastAPI for the excellent web framework
- The heat safety research community

---

**Built with ❤️ for emergency response and public health**
