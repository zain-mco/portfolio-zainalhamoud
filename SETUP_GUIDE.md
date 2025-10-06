# 🚀 Complete Setup Guide - Portfolio with Admin Dashboard

This guide will help you set up and run your complete portfolio system with admin dashboard.

## 📋 System Overview

Your portfolio consists of 3 main parts:
1. **Backend API** (Node.js + Express + MongoDB)
2. **Frontend Portfolio** (React + Vite)
3. **Admin Dashboard** (React + Vite + TailwindCSS)

---

## 🛠️ Prerequisites

Before starting, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local: [Download MongoDB](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** (optional but recommended)
- **Code Editor** (VS Code recommended)
- **Cloudinary Account** (for image uploads) - [Sign up free](https://cloudinary.com/)

---

## 📦 Step 1: Backend Setup

### 1.1 Navigate to Backend Folder

```bash
cd backend
```

### 1.2 Install Dependencies

```bash
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin requests)
- multer (File uploads)
- cloudinary (Image hosting)
- And more...

### 1.3 Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
copy .env.example .env
```

Or manually create `.env` with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/portfolio

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Origins
CORS_ORIGIN_PORTFOLIO=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174

# Admin Default Credentials
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123456
```

### 1.4 Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Paste into your `.env` file

### 1.5 Seed the Database

This creates initial data (admin user, sample content):

```bash
npm run seed
```

You should see:
```
✅ Database seeded successfully!
👤 Admin Credentials:
📧 Email: admin@portfolio.com
🔑 Password: Admin@123456
```

**IMPORTANT:** Save these credentials!

### 1.6 Start the Backend Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════╗
║   🚀 Portfolio API Server Running          ║
║   📍 Port: 5000                            ║
║   📡 API: http://localhost:5000/api        ║
╚════════════════════════════════════════════╝
```

✅ Backend is running!

---

## 🎨 Step 2: Frontend Portfolio Setup

Open a **NEW terminal** (keep backend running).

### 2.1 Navigate to Frontend Folder

```bash
cd frontend-portfolio
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment (Optional)

Create `.env.local` if you need custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2.4 Copy Portfolio CSS

Copy your existing `css/style.css` file to `frontend-portfolio/public/style.css`

```bash
copy ..\css\style.css public\style.css
```

### 2.5 Copy Assets

Copy your assets folder:

```bash
xcopy ..\assets public\assets\ /E /I
```

### 2.6 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

✅ Frontend Portfolio is running!

Open http://localhost:5173/ in your browser to see your portfolio.

---

## ⚙️ Step 3: Admin Dashboard Setup

Open **ANOTHER NEW terminal** (keep both backend and frontend running).

### 3.1 Navigate to Admin Dashboard Folder

```bash
cd admin-dashboard
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment (Optional)

Create `.env.local` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.4 Start Admin Dashboard

```bash
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5174/
```

✅ Admin Dashboard is running!

Open http://localhost:5174/ in your browser.

---

## 🔐 Step 4: Login to Admin Dashboard

1. Go to http://localhost:5174/
2. Use the credentials from the seed step:
   - **Email:** admin@portfolio.com
   - **Password:** Admin@123456

3. You should see the admin dashboard! 🎉

---

## 🎯 Quick Start Summary

For next time, run these commands in 3 separate terminals:

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

Then access:
- 🌐 Portfolio: http://localhost:5173/
- ⚙️ Admin: http://localhost:5174/
- 📡 API: http://localhost:5000/api/health

---

## 📝 Using the Admin Dashboard

### Managing Projects

1. Go to **Projects** in sidebar
2. Click **Add Project**
3. Fill in:
   - Project Name
   - Description
   - Category (Web Development/UI-UX Design/Mobile App)
   - Upload Image
   - Project Link
   - Technologies (comma separated)
4. Click **Create Project**

The project will immediately appear on your portfolio!

### Managing Personal Info

1. Go to **Personal Info**
2. Update:
   - Name, Title, Bio
   - Upload new profile image
   - Typewriter texts
   - Hero stats (projects count, experience, satisfaction)
3. Click **Save Changes**

### Managing Skills

1. Go to **Skills**
2. Add/Edit/Delete skills
3. Set percentage for each skill
4. Choose category
5. Reorder using drag & drop

### Viewing Messages

1. Go to **Messages**
2. View all contact form submissions
3. Mark as read
4. Delete messages

### Updating Settings

1. Go to **Settings**
2. Change theme colors
3. Update SEO settings
4. Configure analytics

---

## 🚀 Deployment

### Backend (API)

Deploy to:
- **Railway.app** (Recommended, Free tier)
- **Render.com** (Free tier)
- **Heroku**
- **DigitalOcean**

Steps:
1. Create account on chosen platform
2. Connect your GitHub repository
3. Add environment variables
4. Deploy!

### Frontend & Admin

Deploy to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**

Steps:
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Update API URL in production

---

## 🔧 Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Verify `.env` file exists
- ✅ Ensure port 5000 is not in use
- ✅ Run `npm install` again

### Frontend shows errors
- ✅ Check if backend is running
- ✅ Verify API URL in `.env.local`
- ✅ Clear browser cache
- ✅ Run `npm install` again

### Can't login to admin
- ✅ Verify you ran `npm run seed`
- ✅ Check credentials match seed output
- ✅ Ensure backend is running
- ✅ Check browser console for errors

### Images won't upload
- ✅ Verify Cloudinary credentials in `.env`
- ✅ Check internet connection
- ✅ Ensure image size is under 5MB

### MongoDB connection fails
- ✅ Check MONGODB_URI in `.env`
- ✅ If local: Ensure MongoDB service is running
- ✅ If Atlas: Check connection string and IP whitelist

---

## 📚 API Documentation

### Public Endpoints (No Auth Required)

```
GET  /api/personal          - Get personal info
GET  /api/about             - Get about section
GET  /api/skills            - Get all skills
GET  /api/projects          - Get all projects
GET  /api/projects/:id      - Get single project
GET  /api/contact           - Get contact info
GET  /api/settings          - Get site settings
POST /api/contact/messages  - Submit contact message
```

### Protected Endpoints (Auth Required)

All routes below require Bearer token in Authorization header.

```
POST   /api/auth/login           - Login
POST   /api/auth/register        - Register new admin
GET    /api/auth/me              - Get current user

PUT    /api/personal             - Update personal info
POST   /api/personal/upload-image - Upload profile image

PUT    /api/about                - Update about section
POST   /api/about/experience     - Add work experience
PUT    /api/about/experience/:id - Update work experience
DELETE /api/about/experience/:id - Delete work experience

POST   /api/skills               - Create skill
PUT    /api/skills/:id           - Update skill
DELETE /api/skills/:id           - Delete skill
PUT    /api/skills/reorder       - Reorder skills

POST   /api/projects             - Create project
PUT    /api/projects/:id         - Update project
DELETE /api/projects/:id         - Delete project
POST   /api/projects/upload      - Upload project image
PUT    /api/projects/reorder     - Reorder projects

PUT    /api/contact              - Update contact info
GET    /api/contact/messages     - Get all messages
PUT    /api/contact/messages/:id/read - Mark message as read
DELETE /api/contact/messages/:id - Delete message

PUT    /api/settings             - Update site settings
```

---

## 🎨 Customization

### Change Theme Colors

Admin Dashboard → Settings → Theme Colors

Or edit:
- Backend: `models/Settings.js` (defaults)
- Frontend: CSS variables in `style.css`

### Add New Sections

1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create route in `backend/routes/`
4. Add to `server.js`
5. Create admin page in `admin-dashboard/src/pages/`
6. Add API functions in `admin-dashboard/src/services/api.js`
7. Update frontend portfolio to display new section

---

## 📞 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all environment variables
5. Ensure all dependencies are installed

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected successfully
- [ ] Database seeded with initial data
- [ ] Frontend portfolio running on port 5173
- [ ] Admin dashboard running on port 5174
- [ ] Can login to admin dashboard
- [ ] Can create/edit/delete projects
- [ ] Projects appear on frontend portfolio
- [ ] Images upload successfully
- [ ] All sections working properly

---

## 🎉 Congratulations!

You now have a fully functional portfolio website with a powerful admin dashboard!

**Next Steps:**
1. Customize your portfolio content via admin dashboard
2. Add your real projects
3. Update your personal information
4. Test all features
5. Deploy to production

Happy coding! 🚀
