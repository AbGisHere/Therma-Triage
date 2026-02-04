# 📦 GitHub Integration Guide - Therma-Triage Backend

## 🎯 Objective
Upload your backend files to the team's GitHub repo into the `backend/` folder (not a subfolder).

---

## 📋 Prerequisites

1. **GitHub repo URL** - Get this from your team
2. **Git installed** - Check with `git --version`
3. **GitHub access** - Make sure you have write permissions to the repo

---

## 🚀 Step-by-Step Instructions

### **Option 1: If Repo is NOT Cloned Yet** (Recommended)

#### Step 1: Clone the Team Repo
```bash
# Navigate to where you want to clone
cd ~/Documents  # or wherever you prefer

# Clone the repo (replace with your actual repo URL)
git clone https://github.com/your-org/therma-triage.git
cd therma-triage
```

#### Step 2: Copy Backend Files to the backend/ Folder
```bash
# Make sure backend folder exists
mkdir -p backend

# Copy all Python files (NOT the venv or __pycache__)
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.py backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.txt backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.md backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/.gitignore backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/.env.example backend/
```

#### Step 3: Verify Files Were Copied
```bash
ls -la backend/
```

**You should see:**
- ✅ `main.py`, `auth.py`, `database.py`, `logic.py`, `schemas.py`
- ✅ `hospital_routes.py`, `hospital_db.py`
- ✅ `requirements.txt`
- ✅ All `.md` files (README, TESTING_GUIDE, etc.)
- ✅ `.gitignore`, `.env.example`
- ❌ NO `venv/` folder
- ❌ NO `__pycache__/` folder

#### Step 4: Commit and Push
```bash
# Add all backend files
git add backend/

# Commit with a clear message
git commit -m "feat: Add complete Therma-Triage backend API

- FastAPI application with 24 endpoints
- User-facing API (WBGT, triage, resources)
- Hospital dashboard API (14 protected endpoints)
- JWT authentication system
- Demo data with hospitals, beds, staff, resources
- Comprehensive documentation

Endpoints:
- Weather/WBGT calculation
- AI-powered triage routing
- Hospital bed management
- Resource tracking
- Staff surge monitoring
- Analytics and trends"

# Push to GitHub
git push origin main  # or 'master' depending on your default branch
```

---

### **Option 2: If Repo is Already Cloned**

#### Step 1: Navigate to Your Cloned Repo
```bash
cd ~/path/to/your/cloned/therma-triage
```

#### Step 2: Pull Latest Changes
```bash
git pull origin main
```

#### Step 3: Copy Backend Files
```bash
# Make sure backend folder exists
mkdir -p backend

# Copy all necessary files
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.py backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.txt backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/*.md backend/
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/.gitignore backend/.gitignore-backend
cp /Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend/.env.example backend/
```

#### Step 4: Commit and Push (same as Option 1 Step 4)

---

## 📁 Expected Folder Structure After Push

```
therma-triage/                  # Root of GitHub repo
├── backend/                    # ✅ Your backend files go here
│   ├── main.py                # ✅ FastAPI application
│   ├── auth.py                # ✅ JWT authentication
│   ├── database.py            # ✅ In-memory/SQLite database
│   ├── logic.py               # ✅ WBGT + triage logic
│   ├── schemas.py             # ✅ Pydantic models
│   ├── hospital_routes.py     # ✅ Hospital dashboard endpoints
│   ├── hospital_db.py         # ✅ Extended hospital data
│   ├── requirements.txt       # ✅ Python dependencies
│   ├── README.md              # ✅ Setup guide
│   ├── TESTING_GUIDE.md       # ✅ Testing examples
│   ├── ARCHITECTURE.md        # ✅ System architecture
│   ├── QUICK_REFERENCE.md     # ✅ API reference
│   ├── MERGE_READY.md         # ✅ Integration guide
│   ├── .env.example           # ✅ Environment template
│   └── .gitignore-backend     # ✅ Ignored files list
├── frontend/                   # Frontend team's code
│   ├── user-app/              # User-facing web app
│   └── hospital-dashboard/    # Hospital management portal
└── README.md                   # Project-wide README

```

---

## 🔧 Quick Copy Script (Copy & Paste This)

Save this as `copy-to-repo.sh` and run it:

```bash
#!/bin/bash

# Configuration - UPDATE THESE!
REPO_PATH="$HOME/path/to/therma-triage"  # ⚠️ UPDATE THIS PATH!
SOURCE_PATH="/Users/ranveer161984gmail.com/.gemini/antigravity/scratch/therma-backend"

# Navigate to repo
cd "$REPO_PATH" || exit 1

# Create backend folder
mkdir -p backend

# Copy files
echo "📦 Copying backend files..."
cp "$SOURCE_PATH"/*.py backend/
cp "$SOURCE_PATH"/*.txt backend/
cp "$SOURCE_PATH"/*.md backend/
cp "$SOURCE_PATH"/.env.example backend/
cp "$SOURCE_PATH"/.gitignore backend/.gitignore-backend

# Show what was copied
echo "✅ Files copied:"
ls -lh backend/

# Git operations
echo "📤 Adding to git..."
git add backend/

echo "✅ Ready to commit!"
echo "Run: git commit -m 'feat: Add backend API' && git push"
```

**To use:**
```bash
# 1. Update REPO_PATH in the script above
# 2. Save as copy-to-repo.sh
# 3. Make executable
chmod +x copy-to-repo.sh

# 4. Run it
./copy-to-repo.sh

# 5. Commit and push
git commit -m "feat: Add complete backend API"
git push origin main
```

---

## 🤝 After Pushing to GitHub

### **For Frontend Developers**

Create a `backend/README.md` in the repo explaining how to run:

```markdown
# Therma-Triage Backend Setup

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run Server**
   ```bash
   python main.py
   ```

3. **Access API**
   - Server: http://localhost:8000
   - Swagger UI: http://localhost:8000/docs
   - API for User Frontend: No auth needed
   - API for Hospital Dashboard: Requires login (admin/admin123)

## Documentation
- See `MERGE_READY.md` for complete integration guide
- See `TESTING_GUIDE.md` for API examples
- See `ARCHITECTURE.md` for system design
```

---

## 🌐 Setting Up for Production Deployment

### **Environment Variables**
```bash
# In your repo, create backend/.env
cp backend/.env.example backend/.env

# Edit with real values
OPENWEATHER_API_KEY=your_real_api_key
JWT_SECRET_KEY=your_very_secure_random_key_here
DATABASE_URL=sqlite:///./therma_triage.db
```

### **For Deployment Platforms**

#### **Vercel/Netlify/Railway:**
```bash
# Root directory: backend
# Build command: pip install -r requirements.txt
# Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### **Docker (Optional):**
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📊 Integration Steps for Complete Stack

### **Step 1: Backend Dev (You) ✅**
- [x] Upload backend files to GitHub
- [x] Document API endpoints
- [x] Provide demo credentials

### **Step 2: Frontend Devs**
- [ ] Clone repo: `git clone <repo-url>`
- [ ] Set up backend: `cd backend && pip install -r requirements.txt`
- [ ] Run backend: `python main.py`
- [ ] Point frontend API calls to `http://localhost:8000`
- [ ] Test integration

### **Step 3: Testing Integration**
- [ ] User frontend can call weather, triage, map endpoints
- [ ] Hospital dashboard can authenticate and fetch data
- [ ] All endpoints return expected data format

### **Step 4: Deployment**
- [ ] Deploy backend to cloud (Render, Railway, etc.)
- [ ] Update frontend to use production backend URL
- [ ] Deploy frontend
- [ ] Test live integration

---

## ⚠️ Important Notes

### **DO NOT Commit:**
- ❌ `venv/` folder
- ❌ `__pycache__/` folder
- ❌ `.env` file (use `.env.example` instead)
- ❌ `*.db` database files
- ❌ `*.pyc` compiled Python files

**Your `.gitignore` already handles this!** ✅

### **DO Commit:**
- ✅ All `.py` files
- ✅ `requirements.txt`
- ✅ All `.md` documentation
- ✅ `.env.example` template
- ✅ `.gitignore`

---

## 🆘 Troubleshooting

### "Permission denied" error
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings > SSH Keys
cat ~/.ssh/id_ed25519.pub
```

### "Repo not found" error
```bash
# Check remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/your-org/therma-triage.git
```

### Files not showing up
```bash
# Check git status
git status

# Make sure files are added
git add backend/
git status  # Should show files in green
```

---

## ✅ Verification Checklist

Before pushing, verify:
- [ ] All `.py` files copied
- [ ] `requirements.txt` present
- [ ] Documentation files included
- [ ] `.env.example` (not `.env`)
- [ ] `.gitignore` present
- [ ] No `venv/` or `__pycache__/` folders
- [ ] Git status shows correct files

---

## 📞 Next Steps After Push

1. **Notify Frontend Team:**
   ```
   "✅ Backend pushed to GitHub! 
   
   Branch: main
   Location: /backend folder
   
   To set up:
   1. Pull latest: git pull origin main
   2. cd backend
   3. pip install -r requirements.txt
   4. python main.py
   
   Server will run on http://localhost:8000
   Docs at http://localhost:8000/docs
   
   See MERGE_READY.md for integration details!"
   ```

2. **Create GitHub Issues/Tasks:**
   - [ ] Frontend: Integrate user API endpoints
   - [ ] Frontend: Integrate hospital dashboard
   - [ ] Backend: Add real OpenWeather API key
   - [ ] DevOps: Deploy backend to production
   - [ ] Testing: End-to-end integration tests

3. **Schedule Integration Meeting:**
   - Review API endpoints together
   - Test data flow
   - Discuss any needed changes
   - Plan deployment strategy

---

**You're ready to merge! Follow Option 1 or 2 above. Good luck! 🚀**
