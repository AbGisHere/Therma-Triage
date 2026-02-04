# 🚑 Therma-Triage Quick Reference

## 🎯 Project Overview
**Heatwave Emergency Response System** with WBGT calculation, AI triage, and hospital management.

---

## 🗂️ File Structure

```
therma-backend/
├── main.py              # 🚀 FastAPI app & all endpoints (440 lines)
├── schemas.py           # 📋 Pydantic models for validation (170 lines)
├── logic.py             # 🧠 WBGT calculator + AI triage engine (350 lines)
├── database.py          # 💾 In-memory & SQLite database (380 lines)
├── auth.py              # 🔒 JWT authentication system (120 lines)
├── requirements.txt     # 📦 Python dependencies
├── .env.example         # ⚙️ Environment variables template
├── README.md            # 📖 Setup & deployment guide
└── TESTING_GUIDE.md     # 🧪 Complete testing instructions
```

---

## 🔑 Key Components

### **main.py** - FastAPI Application
- **Health Check**: `GET /`
- **Authentication**: `POST /auth/login`, `GET /auth/me`
- **Weather**: `POST /weather/wbgt`
- **Triage**: `POST /triage/submit`
- **Resources**: `GET /map/resources`
- **Hospital Mgmt**: `POST /hospital/update` (protected), `GET /hospital/list` (protected)
- **CORS**: Enabled for frontend
- **Docs**: Auto-generated Swagger UI

### **schemas.py** - Data Models
- `LocationRequest` - GPS coordinates
- `WBGTResponse` - Heat stress data
- `TriageRequest` / `TriageResponse` - Patient triage
- `HospitalUpdate` / `Hospital` - Hospital data
- `Shelter` - Cooling shelter info
- `Token` / `User` / `LoginRequest` - Authentication

### **logic.py** - Business Logic
- **`WBGTCalculator`**
  - `calculate_wbgt()` - Heat index formula
  - `estimate_wet_bulb_temp()` - Humidity adjustment
  - `get_heat_stress_level()` - Risk categorization
  
- **`TriageEngine`**
  - `analyze_symptoms()` - AI severity assessment
  - `find_nearest_facility()` - Routing algorithm
  - Symptom categories: Critical/Severe/Moderate/Mild
  
- **`WeatherService`**
  - OpenWeatherMap API integration
  - Mock data fallback

### **database.py** - Data Layer
- **`InMemoryDatabase`** (default)
  - Fast, no persistence
  - 3 demo hospitals
  - 3 demo shelters
  - Triage logging
  
- **`SQLDatabase`** (production)
  - SQLite persistence
  - SQLAlchemy models
  - Same interface

### **auth.py** - Security
- **JWT token generation**
- **Password hashing** (bcrypt)
- **User authentication**
- **Protected route dependencies**
- Demo users: `admin`/`admin123`, `hospital_staff`/`staff123`

---

## 📊 WBGT Formula

```
$$WBGT = (0.7 × T_{wet\_bulb}) + (0.2 × T_{globe}) + (0.1 × T_{dry\_bulb})$$
```

**Heat Stress Levels:**
- 🟢 **< 27°C**: Low (normal activities)
- 🟡 **27-29°C**: Moderate (take breaks)
- 🟠 **29-31°C**: High (limit activities)
- 🔴 **31-32°C**: Very High (avoid strenuous work)
- ⚫ **> 32°C**: Extreme (stay indoors)

---

## 🧠 Triage Logic

### Symptom Categories

| Severity | Symptoms | Routing |
|----------|----------|---------|
| **Critical** | confusion, unconsciousness, seizure | 🚨 Emergency Room (911) |
| **Severe** | high_fever, chest_pain, difficulty_breathing | 🏥 Hospital |
| **Moderate** | dizziness, nausea, muscle_cramps | 🏥 Hospital / 🏠 Shelter |
| **Mild** | thirst, mild_headache, fatigue | 🏠 Cooling Shelter |

### Risk Factors
- **Age**: Elderly (65+) and children (≤5) → increased severity
- **WBGT**: Extreme heat (≥32°C) → escalated routing
- **Symptom Count**: Multiple symptoms → higher severity

---

## 🚀 Quick Start Commands

### Setup
```bash
cd therma-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run Server
```bash
python main.py
# or
uvicorn main:app --reload
```

### Access
- **API**: http://127.0.0.1:8000
- **Docs**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

---

## 🔐 Authentication Flow

1. **Login**: `POST /auth/login` → Get token
2. **Authorize**: Click "Authorize" in Swagger UI
3. **Use**: Access protected endpoints with `Bearer <token>`

---

## 🧪 Test Examples

### WBGT Check
```bash
curl -X POST http://127.0.0.1:8000/weather/wbgt \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.7749, "longitude": -122.4194}'
```

### Triage (Critical)
```bash
curl -X POST http://127.0.0.1:8000/triage/submit \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["confusion", "fever", "hot_dry_skin"],
    "location": {"latitude": 37.7749, "longitude": -122.4194},
    "age": 72
  }'
```

### Get Resources
```bash
curl http://127.0.0.1:8000/map/resources
```

### Update Hospital (needs auth)
```bash
curl -X POST http://127.0.0.1:8000/hospital/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hospital_id": "hosp_001",
    "icu_beds": 20,
    "er_beds": 30,
    "is_diverting": false
  }'
```

---

## 💾 Demo Data

### Hospitals
- **hosp_001**: San Francisco General (12 ICU, 20 ER)
- **hosp_002**: Mission Bay Medical (8 ICU, 15 ER)
- **hosp_003**: Downtown Emergency (5 ICU, 10 ER) - DIVERTING

### Shelters
- **shelter_001**: Downtown Cooling Center (150 capacity, 78 occupied)
- **shelter_002**: Community Rec Center (200 capacity, 95 occupied)
- **shelter_003**: Public Library (100 capacity, 45 occupied)

---

## 🛠️ Switch to SQLite

In `database.py`, line 368:
```python
# Change from:
db = InMemoryDatabase()

# To:
db = SQLDatabase()
```

---

## 🌐 Production Checklist

- [ ] Change `JWT_SECRET_KEY` in `auth.py` (line 16)
- [ ] Set OpenWeatherMap API key in `.env`
- [ ] Switch to `SQLDatabase()` in `database.py`
- [ ] Update CORS origins in `main.py` (line 39)
- [ ] Set up HTTPS/SSL
- [ ] Configure production database
- [ ] Add rate limiting
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Add comprehensive logging

---

## 📚 Technology Stack

- **FastAPI** 0.115+ - Web framework
- **Uvicorn** 0.30+ - ASGI server
- **Pydantic** 2.10+ - Data validation
- **SQLAlchemy** 2.0+ - ORM
- **PyJWT** 2.8+ - Token generation
- **python-jose** 3.3+ - JWT handling
- **bcrypt** 4.2+ - Password hashing
- **requests** 2.31+ - HTTP client

---

## 🎓 Architecture Patterns

### Clean Architecture
- **Separation of Concerns**: Models, logic, routes
- **Dependency Injection**: FastAPI dependencies
- **Interface Segregation**: Public vs protected endpoints

### Security
- **JWT Bearer Authentication**
- **Password Hashing** (bcrypt)
- **CORS Configuration**
- **Input Validation** (Pydantic)

### Database
- **Repository Pattern**
- **In-memory for dev**
- **SQLite for production**
- **Easy to swap** (same interface)

---

## 📞 Support

- **Issues**: Check `TESTING_GUIDE.md`
- **Setup**: See `README.md`
- **API Docs**: http://127.0.0.1:8000/docs

---

**Built for emergency response with ❤️**
