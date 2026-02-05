# Therma-Triage Hospital Command Center

A hospital resource management dashboard for heatwave emergencies, built with Next.js 16 and FastAPI.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ and pip
- Git

### 1. Start Backend Server

```bash
cd BackEnd
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:** `http://localhost:8000`
**API Documentation:** `http://localhost:8000/docs`

### 2. Start Frontend Development Server

```bash
cd hospital
npm install
npm run dev
```

**Frontend will be available at:** `http://localhost:3000`

### 3. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign In" or navigate to `http://localhost:3000/login`
3. Use demo credentials:
   - **Admin:** `admin` / `admin123`
   - **Staff:** `hospital_staff` / `staff123`

## 🏥 Features

### Dashboard Overview
- Real-time bed capacity monitoring (ICU/ER/General)
- Resource inventory tracking with alerts
- Staff surge level monitoring
- Hospital divert/accepting status
- Incoming triage queue
- Analytics and trends

### Authentication
- JWT-based authentication system
- Secure API endpoints
- Role-based access control

### Backend APIs
- **Authentication:** `/auth/login`, `/auth/me`
- **Hospital Data:** `/hospital/beds/stats`, `/hospital/resources`, `/hospital/staff/surge-level`
- **User Actions:** `/hospital/update-beds`, `/hospital/update-status`, `/hospital/staff/backup`
- **Analytics:** `/hospital/analytics`, `/hospital/triage-queue`

### Frontend Pages
- **Dashboard:** `/` - Main overview with critical alerts
- **Beds Management:** `/beds` - Detailed bed inventory
- **Resources:** `/resources` - Resource management and alerts
- **Staff:** `/staff` - Staff roster and fatigue levels
- **Settings:** `/settings` - System configuration

## 🔧 Development

### Environment Variables

Create `.env.local` in the `hospital` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Application Configuration
NODE_ENV=development
```

### Project Structure

```
hospital/                 # Next.js Frontend
├── src/
│   ├── app/             # App Router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth, Theme)
│   └── lib/             # API client and utilities
├── public/              # Static assets
└── package.json

BackEnd/                  # FastAPI Backend
├── main.py              # FastAPI application
├── auth.py              # JWT authentication
├── schemas.py           # Pydantic models
├── hospital_routes.py    # Hospital endpoints
├── hospital_db.py       # Database layer
└── requirements.txt     # Python dependencies
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 8000 already in use:**
   ```bash
   # Kill existing process
   pkill -f "python.*uvicorn"
   # Or use different port
   python3 -m uvicorn main:app --port 8001
   ```

2. **Port 3000 already in use:**
   ```bash
   # Kill existing process
   pkill -f "npm run dev"
   # Or use different port
   npm run dev -- -p 3001
   ```

3. **Authentication errors:**
   - Ensure backend is running on port 8000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify demo credentials are correct

4. **Build errors:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### API Testing

Test backend endpoints directly:

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get bed stats (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/hospital/beds/stats
```

## 📊 Monitoring

### Health Checks
- **Backend Health:** `http://localhost:8000/`
- **Frontend Health:** `http://localhost:3000`

### Logs
- **Backend:** Console output from uvicorn
- **Frontend:** Browser developer console and Next.js dev server

## 🚀 Production Deployment

### Backend Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and support:
- Check the troubleshooting section above
- Review API documentation at `http://localhost:8000/docs`
- Verify backend and frontend are both running
- Check browser console for JavaScript errors
