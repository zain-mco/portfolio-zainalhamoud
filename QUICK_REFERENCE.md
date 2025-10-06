# ⚡ Quick Reference Guide

## 🚀 Start Everything (3 Commands)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Portfolio:**
```bash
cd frontend-portfolio
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin-dashboard
npm run dev
```

Or on Windows, just run: `START_ALL.bat`

---

## 🌐 URLs

- Portfolio: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:5000/api

---

## 🔑 Default Login

- Email: `admin@portfolio.com`
- Password: `Admin@123456`

---

## 📝 Common Tasks

### Add a Project
1. Login to admin (http://localhost:5174)
2. Click "Projects" in sidebar
3. Click "Add Project" button
4. Fill form & upload image
5. Click "Create Project"

### Update Personal Info
1. Go to "Personal Info" page
2. Edit any field
3. Click "Save Changes"

### View Messages
1. Go to "Messages" page
2. See all contact form submissions
3. Mark as read or delete

### Change Theme
1. Go to "Settings" page
2. Update theme colors
3. Save changes

---

## 🛠️ First Time Setup

1. Install dependencies:
   ```bash
   # Run in project root
   INSTALL_ALL.bat
   ```

2. Configure backend:
   - Copy `backend/.env.example` to `backend/.env`
   - Add MongoDB URI
   - Add Cloudinary credentials
   - Set JWT secret

3. Seed database:
   ```bash
   cd backend
   npm run seed
   ```

4. Start servers (see top of this file)

---

## 📦 Install Dependencies

### All at once (Windows):
```bash
INSTALL_ALL.bat
```

### Individually:
```bash
cd backend && npm install
cd ../frontend-portfolio && npm install
cd ../admin-dashboard && npm install
```

---

## 🗄️ Database Commands

### Seed database:
```bash
cd backend
npm run seed
```

### Clear and reseed:
Delete database manually in MongoDB, then run seed again.

---

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Check .env file exists
# Try: cd backend && npm install
```

### Frontend shows errors
```bash
# Check backend is running
# Try: cd frontend-portfolio && npm install
```

### Can't login
```bash
# Run: cd backend && npm run seed
# Use: admin@portfolio.com / Admin@123456
```

### Images won't upload
```bash
# Check Cloudinary credentials in backend/.env
# Verify internet connection
```

---

## 📡 API Endpoints

### Test API:
```bash
curl http://localhost:5000/api/health
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@portfolio.com\",\"password\":\"Admin@123456\"}"
```

### Get Projects:
```bash
curl http://localhost:5000/api/projects
```

---

## 📂 Important Files

- `backend/.env` - Environment variables
- `backend/server.js` - Main backend file
- `frontend-portfolio/src/App.jsx` - Main portfolio component
- `admin-dashboard/src/App.jsx` - Main admin component
- `SETUP_GUIDE.md` - Full setup instructions

---

## 🔄 Update Workflow

1. Make changes via admin dashboard
2. Changes saved to MongoDB
3. Frontend automatically fetches new data
4. Refresh portfolio to see updates

---

## 💾 Build for Production

### Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend-portfolio
npm run build
# Deploy dist/ folder
```

### Admin:
```bash
cd admin-dashboard
npm run build
# Deploy dist/ folder
```

---

## 📞 Need Help?

1. Read `SETUP_GUIDE.md` for detailed instructions
2. Check `backend/README.md` for API docs
3. Check `admin-dashboard/README.md` for dashboard docs
4. Look at browser console (F12) for errors
5. Check terminal for error messages

---

## ✅ System Health Check

Run these commands to verify everything works:

```bash
# Test backend
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Portfolio API is running"}
```

Open in browser:
- ✅ http://localhost:5173 - Should show portfolio
- ✅ http://localhost:5174 - Should show login page
- ✅ http://localhost:5000/api/health - Should show JSON response

---

## 🎯 Quick Commands Reference

| Task | Command |
|------|---------|
| Install all | `INSTALL_ALL.bat` |
| Start all | `START_ALL.bat` |
| Seed DB | `cd backend && npm run seed` |
| Backend dev | `cd backend && npm run dev` |
| Frontend dev | `cd frontend-portfolio && npm run dev` |
| Admin dev | `cd admin-dashboard && npm run dev` |
| Build frontend | `cd frontend-portfolio && npm run build` |
| Build admin | `cd admin-dashboard && npm run build` |

---

## 🔐 Environment Variables Template

`backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=change_this_to_something_secure_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN_PORTFOLIO=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
```

---

## 🎨 Project Structure (Simplified)

```
portfolio2/
├── backend/           # API Server
├── frontend-portfolio/  # Public Website
├── admin-dashboard/   # Admin Panel
├── css/              # Original CSS (copy to frontend)
├── assets/           # Images (copy to frontend)
└── index.html        # Original site (keep as backup)
```

---

*Keep this file handy for quick reference!* 📌
