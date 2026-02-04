# 🏗️ Therma-Triage System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      THERMA-TRIAGE API                          │
│                    (FastAPI Application)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │    │   Mobile     │    │   External   │
│  Dashboard   │    │     App      │    │   Systems    │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 📦 Component Architecture

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         main.py                           ┃
┃                   FastAPI Application                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                           ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      ┃
┃  │   System    │  │     Auth    │  │   Weather   │      ┃
┃  │  Endpoints  │  │  Endpoints  │  │  Endpoints  │      ┃
┃  │             │  │             │  │             │      ┃
┃  │  GET /      │  │ POST /auth/ │  │ POST /weath │      ┃
┃  │             │  │    login    │  │    er/wbgt  │      ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘      ┃
┃                                                           ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      ┃
┃  │   Triage    │  │  Resources  │  │  Hospital   │      ┃
┃  │  Endpoints  │  │  Endpoints  │  │  Mgmt (🔒) │      ┃
┃  │             │  │             │  │             │      ┃
┃  │ POST /tria  │  │ GET /map/   │  │ POST /hosp  │      ┃
┃  │   ge/submit │  │   resources │  │  ital/updat │      ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘      ┃
┃                                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
           │                  │                  │
           ▼                  ▼                  ▼
┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓
┃   schemas.py  ┃  ┃    logic.py   ┃  ┃   database.py ┃
┃               ┃  ┃               ┃  ┃               ┃
┃  Pydantic     ┃  ┃  Business     ┃  ┃  Data Layer   ┃
┃  Models       ┃  ┃  Logic        ┃  ┃               ┃
┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛
           │                  │                  │
           └──────────┬───────┴──────────┬───────┘
                      ▼                  ▼
              ┏━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━┓
              ┃    auth.py    ┃  ┃ External APIs ┃
              ┃               ┃  ┃               ┃
              ┃  JWT Security ┃  ┃ OpenWeather   ┃
              ┗━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━┛
```

---

## 🔄 Request Flow Diagrams

### 1. WBGT Calculation Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /weather/wbgt
       │ {lat, lon}
       ▼
┌─────────────────────────────────────┐
│        main.py: get_wbgt()          │
└──────┬──────────────────────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────┐    ┌──────────────────┐
│ WeatherSvc   │    │ WBGTCalculator   │
│ get_weather  │    │ calculate_wbgt() │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       └──────┬──────────────┘
              ▼
       ┌──────────────┐
       │   Response   │
       │   {wbgt,     │
       │    heat_lvl, │
       │    advice}   │
       └──────────────┘
```

### 2. Triage & Routing Flow

```
┌─────────────┐
│   Patient   │
└──────┬──────┘
       │ POST /triage/submit
       │ {symptoms, location, age}
       ▼
┌────────────────────────────────────────────┐
│      main.py: submit_triage()              │
└┬───────────┬────────────┬──────────────────┘
 │           │            │
 ▼           ▼            ▼
┌──────┐  ┌────────┐  ┌──────────┐
│Weather│ │ Triage │  │ Database │
│Service│ │ Engine │  │ Facility │
└───┬───┘ └───┬────┘  └────┬─────┘
    │         │            │
    └────┬────┴────┬───────┘
         ▼         ▼
    ┌─────────────────────┐
    │  analyze_symptoms() │
    │  - Severity level   │
    │  - Risk factors     │
    │  - Routing decision │
    └──────────┬──────────┘
               ▼
    ┌──────────────────────┐
    │ find_nearest_facility│
    │  - Filter by type    │
    │  - Check availability│
    │  - Calculate distance│
    └──────────┬──────────┘
               ▼
         ┌───────────┐
         │  Response │
         │ {severity,│
         │  routing, │
         │  facility}│
         └───────────┘
```

### 3. Hospital Update Flow (Protected)

```
┌──────────────┐
│Hospital Staff│
└──────┬───────┘
       │ 1. POST /auth/login
       │    {username, password}
       ▼
┌──────────────────────┐
│   authenticate_user()│
│   - Verify password  │
│   - Generate JWT     │
└──────┬───────────────┘
       │ JWT Token
       ▼
┌──────────────┐
│Hospital Staff│
└──────┬───────┘
       │ 2. POST /hospital/update
       │    Authorization: Bearer <token>
       │    {hospital_id, beds, divert}
       ▼
┌────────────────────────┐
│ get_current_user()     │
│ - Validate JWT         │
│ - Extract user info    │
└──────┬─────────────────┘
       │ User authenticated ✓
       ▼
┌────────────────────────┐
│ update_hospital()      │
│ - Verify hospital ID   │
│ - Update capacity      │
│ - Set divert status    │
└──────┬─────────────────┘
       ▼
  ┌──────────┐
  │ Database │
  │ Updated  │
  └──────────┘
```

---

## 🗄️ Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────┐      ┌────────────────────┐    │
│  │ InMemoryDatabase  │  OR  │   SQLDatabase      │    │
│  │                   │      │   (SQLAlchemy)     │    │
│  ├───────────────────┤      ├────────────────────┤    │
│  │ hospitals: dict   │      │ HospitalModel      │    │
│  │ shelters: dict    │      │ ShelterModel       │    │
│  │ triage_logs: list │      │ TriageLogModel     │    │
│  └───────────────────┘      └────────────────────┘    │
│                                                         │
│  Common Interface:                                      │
│  - get_all_hospitals()                                  │
│  - get_all_shelters()                                   │
│  - update_hospital(id, beds...)                         │
│  - log_triage(data)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌────────────────────────────────────────────────────┐
│              Security Layers                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. Input Validation (Pydantic)                    │
│     ┌────────────────────────────────────┐        │
│     │ - Type checking                    │        │
│     │ - Range validation (lat/lon)       │        │
│     │ - Required field enforcement       │        │
│     └────────────────────────────────────┘        │
│                                                    │
│  2. Authentication (JWT)                           │
│     ┌────────────────────────────────────┐        │
│     │ - Password hashing (bcrypt)        │        │
│     │ - Token generation (HS256)         │        │
│     │ - Token validation                 │        │
│     │ - Expiration (60 min)              │        │
│     └────────────────────────────────────┘        │
│                                                    │
│  3. Authorization (Dependencies)                   │
│     ┌────────────────────────────────────┐        │
│     │ - Bearer token extraction          │        │
│     │ - User role verification           │        │
│     │ - Endpoint access control          │        │
│     └────────────────────────────────────┘        │
│                                                    │
│  4. CORS Protection                                │
│     ┌────────────────────────────────────┐        │
│     │ - Origin validation                │        │
│     │ - Credential handling              │        │
│     │ - Method restrictions              │        │
│     └────────────────────────────────────┘        │
└────────────────────────────────────────────────────┘
```

---

## 🧠 Triage Engine Decision Tree

```
                    Patient Symptoms
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   Normalize & Categorize Symptoms   │
        └──────────────┬──────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌────────┐   ┌─────────┐   ┌─────────┐
    │Critical│   │ Severe  │   │Moderate │
    │Symptoms│   │Symptoms │   │Symptoms │
    └───┬────┘   └────┬────┘   └────┬────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
          ┌───────────────────────┐
          │  Apply Risk Factors:  │
          │  - Age (elderly/young)│
          │  - WBGT (heat level)  │
          └──────────┬────────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
┌──────────┐  ┌───────────┐  ┌──────────┐
│ CRITICAL │  │ MODERATE  │  │   MILD   │
│    ↓     │  │     ↓     │  │    ↓     │
│Emergency │  │ Hospital  │  │ Cooling  │
│   Room   │  │or Shelter │  │ Shelter  │
└──────────┘  └───────────┘  └──────────┘
      │              │              │
      └──────────────┼──────────────┘
                     ▼
         ┌───────────────────────┐
         │ Find Nearest Facility │
         │ - Filter by type      │
         │ - Check availability  │
         │ - Calculate distance  │
         └──────────┬────────────┘
                    ▼
              ┌──────────┐
              │ Response │
              │ to Client│
              └──────────┘
```

---

## 📊 System Metrics & Monitoring Points

```
┌──────────────────────────────────────────────────┐
│           Recommended Monitoring                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  ⏱️  Response Times                              │
│     - /weather/wbgt: < 200ms                     │
│     - /triage/submit: < 500ms                    │
│     - /map/resources: < 100ms                    │
│                                                  │
│  📈 Request Volume                                │
│     - Total requests/min                         │
│     - Endpoint distribution                      │
│     - Peak load times                            │
│                                                  │
│  🚨 Error Rates                                   │
│     - 4xx errors (client)                        │
│     - 5xx errors (server)                        │
│     - Authentication failures                    │
│                                                  │
│  🏥 Business Metrics                             │
│     - Triage severity distribution               │
│     - Hospital bed utilization                   │
│     - Geographic hotspots                        │
│     - Average WBGT levels                        │
│                                                  │
│  🔒 Security Events                              │
│     - Failed login attempts                      │
│     - Invalid tokens                             │
│     - Unauthorized access attempts               │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Production Stack                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │         Load Balancer (Nginx)            │      │
│  └──────────────┬───────────┬───────────────┘      │
│                 │           │                       │
│      ┌──────────┴────┐  ┌───┴─────────┐            │
│      │  uvicorn:8000 │  │uvicorn:8001 │            │
│      │  (Worker 1)   │  │ (Worker 2)  │            │
│      └───────┬───────┘  └──────┬──────┘            │
│              │                 │                    │
│              └────────┬────────┘                    │
│                       │                             │
│              ┌────────▼────────┐                    │
│              │   PostgreSQL    │                    │
│              │   Database      │                    │
│              └─────────────────┘                    │
│                                                     │
│  External Services:                                 │
│  ┌──────────────┐  ┌───────────────┐              │
│  │OpenWeatherMap│  │  Auth Service │              │
│  │     API      │  │   (optional)  │              │
│  └──────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 API Versioning Strategy

```
/api/v1/weather/wbgt      ← Current version
/api/v2/weather/wbgt      ← Future version (enhanced)

Version upgrade path:
v1.0 (current) → v1.1 (backward compatible)
               → v2.0 (breaking changes, parallel deployment)
```

---

## 📝 Code Organization Principles

### 1. **Separation of Concerns**
- **main.py**: HTTP layer (routes, middleware)
- **logic.py**: Business rules (no HTTP knowledge)
- **database.py**: Data persistence (no business logic)
- **schemas.py**: Data contracts (validation only)
- **auth.py**: Security concerns (isolated)

### 2. **Dependency Direction**
```
main.py  ──────────────┐
    │                  │
    ▼                  ▼
logic.py ────────▶ schemas.py
    │                  ▲
    ▼                  │
database.py ───────────┘
```

### 3. **Interface Consistency**
- All database methods return consistent types
- All logic functions are pure (no side effects where possible)
- All endpoints follow RESTful conventions

---

**Architecture designed for scalability, maintainability, and emergency response reliability.**
