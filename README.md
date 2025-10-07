# 🚀 Modern Portfolio Website with Admin Dashboard

A complete full-stack portfolio system featuring a stunning React-based portfolio website and a powerful admin dashboard for content management.

## ✨ System Overview

This project consists of three integrated applications:

1. **Backend API** - Node.js + Express + MongoDB REST API
2. **Frontend Portfolio** - React portfolio website with beautiful UI
3. **Admin Dashboard** - Full-featured admin panel for content management

---

## 🎯 Features

### Portfolio Website
- Modern, responsive design with 3D effects
- Smooth scroll animations
- Particle background effects
- Dynamic project filtering
- Contact form integration
- SEO optimized

### Admin Dashboard
- 📊 Dashboard with analytics
- 📝 Projects management (CRUD operations)
- 👤 Personal info editor
- 🎓 Work experience & education manager
- 🎯 Skills management with percentages
- 📧 Contact info management
- 💬 Messages inbox
- ⚙️ Site settings & theme customization
- 🖼️ Image upload with Cloudinary
- 🔐 Secure authentication

### Backend API
- RESTful API architecture
- JWT authentication
- MongoDB database
- File upload handling
- Input validation
- Rate limiting
- CORS configuration

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for images)

### Installation

**Option 1: Automated (Windows)**
```bash
# Install all dependencies
INSTALL_ALL.bat

# Configure backend/.env file
# Then seed database:
cd backend
npm run seed
cd ..

# Start all servers
START_ALL.bat
```

**Option 2: Manual**
```bash
# Backend
cd backend
npm install
# Configure .env file
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend-portfolio
npm install
npm run dev

# Admin (new terminal)
cd admin-dashboard
npm install
npm run dev
```

### Access Points

- 🌐 **Portfolio**: http://localhost:5173
- ⚙️ **Admin**: http://localhost:5174
- 📡 **API**: http://localhost:5000/api

### Default Admin Credentials

---

## 📁 Project Structure

```
portfolio2/
├── backend/                 # Backend API
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & upload middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities & seed script
│   └── server.js           # Express app
│
├── frontend-portfolio/     # React Portfolio
│   ├── src/
│   │   ├── services/       # API integration
│   │   ├── App.jsx         # Main component
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── admin-dashboard/        # React Admin Dashboard
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Dashboard pages
│   │   ├── services/       # API services
│   │   └── App.jsx
│   └── package.json
│
├── SETUP_GUIDE.md          # Detailed setup instructions
├── START_ALL.bat           # Start all servers (Windows)
└── INSTALL_ALL.bat         # Install all dependencies (Windows)
```

---

## 📚 Documentation

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed installation & configuration
- **[Backend README](backend/README.md)** - API documentation
- **[Admin Dashboard README](admin-dashboard/README.md)** - Dashboard features

---

## 🛠️ Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary (Image hosting)
- Bcrypt (Password hashing)
- Multer (File uploads)

### Frontend Portfolio
- React 18
- Vite
- React Query
- Axios
- AOS (Animations)
- Particles.js

### Admin Dashboard
- React 18
- React Router v6
- TailwindCSS
- React Query
- React Hook Form
- Lucide Icons
- React Hot Toast

---

## 🎨 Admin Dashboard Pages

1. **Dashboard** - Overview with stats and recent activity
2. **Personal Info** - Edit profile, hero section, typewriter texts
3. **About** - Manage work experience, education, certifications
4. **Skills** - Add/edit skills with percentages and categories
5. **Projects** - Full project management with image uploads
6. **Contact** - Update contact information and social links
7. **Messages** - View and manage contact form submissions
8. **Settings** - Configure theme colors, SEO, analytics

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN_PORTFOLIO=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174
```

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from dashboard
3. Add to `.env` file

---

## 📡 API Endpoints

### Public Routes
```
GET  /api/personal          - Get personal info
GET  /api/about             - Get about section
GET  /api/skills            - Get all skills
GET  /api/projects          - Get all projects
GET  /api/contact           - Get contact info
GET  /api/settings          - Get site settings
POST /api/contact/messages  - Submit contact message
```

### Protected Routes (Auth Required)
```
POST   /api/auth/login      - Login
PUT    /api/personal        - Update personal info
POST   /api/projects        - Create project
PUT    /api/projects/:id    - Update project
DELETE /api/projects/:id    - Delete project
... and more
```

---

## 🚀 Deployment

### Backend
Deploy to Railway, Render, or Heroku:
1. Connect GitHub repository
2. Add environment variables
3. Deploy!

### Frontend & Admin
Deploy to Vercel or Netlify:
1. Build: `npm run build`
2. Deploy `dist` folder
3. Update API URL

---

## 🎯 Usage

### Adding a New Project

1. Login to admin dashboard
2. Go to **Projects** page
3. Click **Add Project**
4. Fill in details:
   - Name, description, category
   - Upload image
   - Add project link
   - Add technologies
5. Click **Create Project**
6. Project appears immediately on portfolio!

### Updating Personal Info

1. Go to **Personal Info**
2. Update name, title, bio
3. Upload new profile image
4. Edit typewriter texts
5. Update hero stats
6. Click **Save Changes**

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Rate limiting
- Input validation
- Helmet security headers

---

## 🎨 Customization

### Theme Colors
Admin Dashboard → Settings → Theme Colors

### Add New Section
1. Create model in `backend/models/`
2. Create controller & routes
3. Add admin page
4. Update API services
5. Display on portfolio

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists
- Ensure port 5000 is available

**Can't login:**
- Run `npm run seed` in backend
- Use correct credentials
- Check browser console

**Images won't upload:**
- Verify Cloudinary credentials
- Check image size (max 5MB)
- Ensure internet connection

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting.

---

## 📊 Database Models

- **User** - Admin authentication
- **Personal** - Personal information & hero section
- **About** - Work experience, education, certifications
- **Skill** - Skills with percentages and categories
- **Project** - Portfolio projects
- **Contact** - Contact information and messages
- **Settings** - Site configuration and theme

---

## ✅ Features Checklist

- [x] Full-stack architecture
- [x] User authentication
- [x] Project CRUD operations
- [x] Image upload & hosting
- [x] Dynamic content management
- [x] Responsive design
- [x] Modern admin dashboard
- [x] API documentation
- [x] Database seeding
- [x] Form validation
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Protected routes
- [x] RESTful API
- [x] MongoDB integration

---

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and customize for your own use!

---

## 📄 License

MIT License - Feel free to use this project for your own portfolio!

---

## 👨‍💻 Original Portfolio Design

**Zain L. Alhamoud**
- UI/UX Designer & Web Developer
- Portfolio: [Your Website]
- LinkedIn: [Your LinkedIn]
- Email: zenlalhamoud@gmail.com

---

## 🎉 Credits

- React Team
- TailwindCSS Team
- MongoDB Team
- Cloudinary
- All open-source contributors

---

*Built with ❤️ using modern web technologies*

## 🌟 Features

### Visual Effects
- **3D Transformations**: Interactive 3D cards, buttons, and hover effects
- **Scroll Animations**: Smooth reveal animations using AOS (Animate On Scroll)
- **Particle Background**: Dynamic particle system using Particles.js
- **Parallax Scrolling**: Depth-based scrolling effects
- **Typewriter Effect**: Animated text for dynamic titles
- **Floating Elements**: 3D floating skill badges around profile image

### Modern Design
- **Gradient Color Scheme**: Electric Blue (#0066FF), Purple (#8B5CF6), Teal (#06D6A0)
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Dark Theme**: Professional dark color palette
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Custom Cursor**: Interactive cursor effects on desktop

### Interactive Elements
- **3D Tilt Cards**: Mouse-responsive card tilting
- **Animated Skill Bars**: Progress bars with smooth animations
- **Counter Animations**: Counting statistics on scroll
- **Form Validation**: Real-time form validation with notifications
- **Smooth Navigation**: Seamless scrolling between sections

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Advanced animations, 3D transforms, custom properties
- **JavaScript ES6+**: Modern JavaScript with classes and modules
- **Bootstrap 5**: Responsive grid system and components
- **AOS Library**: Animate On Scroll effects
- **Particles.js**: Interactive particle background
- **Font Awesome**: Professional icon library

## 📁 Project Structure

```
portfolio2/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Custom CSS with 3D effects and animations
├── js/
│   └── main.js            # JavaScript functionality and interactions
├── assets/
│   ├── images/            # Profile and project images
│   └── icons/             # Custom icons and favicons
├── README.md              # Project documentation
└── DEVELOPMENT_PROMPT.md  # Detailed development guidelines
```

## 🎨 Design Highlights

### Color Palette
- **Primary**: #0066FF (Electric Blue)
- **Secondary**: #8B5CF6 (Purple)
- **Accent**: #06D6A0 (Teal)
- **Background**: #0f172a (Dark Blue)
- **Text**: #e2e8f0 (Light Gray)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: 800 weight for impact
- **Body**: 400-600 weight for readability
- **Special Effects**: Gradient text for highlights

## 🚀 Getting Started

1. **Clone or Download** the portfolio2 folder
2. **Open** `index.html` in a modern web browser
3. **Customize** content in the HTML file
4. **Replace** placeholder images with actual photos
5. **Update** contact information and social links

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ⚡ Performance Features

- **Hardware Acceleration**: CSS transforms use GPU
- **Debounced Events**: Optimized scroll event handling
- **Lazy Loading**: Images load as needed
- **Minified Assets**: Compressed CSS and JavaScript
- **Progressive Enhancement**: Works without JavaScript

## 🎯 Sections Overview

### 1. Hero Section
- Animated greeting with typewriter effect
- Your actual profile image (zain.svg) with orbital rings
- Floating skill badges: HTML, UI/UX, Figma, CSS
- Real statistics: 15+ Projects, 3+ Years Experience, 100% Satisfaction
- Call-to-action buttons

### 2. About Section
- Personal story about Zain L. Alhamoud
- Professional highlights and experience
- Interactive feature cards
- 3D image container with your profile

### 3. Skills Section
- Your actual skills with accurate percentages:
  - HTML (90%), CSS (90%), JavaScript (85%)
  - React JS (65%), UI/UX Design (90%), Responsive Web (90%)
- Real design tools: Figma, Adobe XD, Photoshop, SASS, Bootstrap, WordPress, PHP, GitHub, SEO
- Interactive hover animations

### 4. Projects Section
- **Filter System**: All Projects, Web Development, UI/UX Design, Mobile App
- **15 Web Development Projects** with live links:
  - Weather App (https://weather-ten-pearl.vercel.app/)
  - 3rd International Breast Cancer Symposium (https://breastcancersymposium.ae/)
  - 2nd Al Ain Neurology Conference 2025 (https://mco.ae/anc2025/)
  - 2nd Annual Diabetes Conference (https://mco.ae/2ndannualdiabetesconference/)
  - 4th Abu Dhabi Brain Conference (https://uaeneurology.com/brainconference2024/)
  - 2nd Radiology Highlights Conference (https://mco.ae/rhcid2024/)
  - 9th International Alzheimer's Conference (https://mco.ae/icadme/)
  - Medical Korea 2024 (https://mco.ae/khidi/)
  - MCO Institute (https://mco.institute/)
  - 1st Diabetes Education Conference (https://mco.ae/1stdiabeteseducationconference/)
  - 5th Abu Dhabi Brain Conference (https://uaeneurology.com/brainconference2025/)
  - 7th Emirates Multiple Sclerosis Forum (https://mco.ae/7thmsf2025/)
  - 3rd Radiology Highlights Conference (https://mco.ae/rhcid2025/)
  - 12th International Neuroscience Congress (https://acpnevents.com/ns-h-ed2025/)
  - 2nd Diabetes Education Conference (https://mco.ae/2nddiabeteseducation/)
- **9 UI/UX Design Prototypes** with Adobe XD/Figma links
- **1 Mobile App** with download link
- Interactive filtering with smooth animations
- Real project images and technology stack badges

### 5. Contact Section
- Simple contact information (no form)
- 3D contact information cards: Email, Location, Social Links
- Professional social media links
- Clean and minimal design

## 🔧 Customization Guide

### Updating Personal Information
1. Edit the hero section text in `index.html`
2. Replace placeholder images with your photos
3. Update project information and links
4. Modify contact details and social links

### Changing Colors
1. Update CSS custom properties in `:root`
2. Modify gradient definitions
3. Adjust particle colors in `main.js`

### Adding New Sections
1. Create HTML structure following existing patterns
2. Add corresponding CSS styles
3. Include AOS animations for scroll effects
4. Update navigation links

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Zain L. Alhamoud**
- UI/UX Designer & Web Developer
- 27 years old, Syria
- 3+ years experience
- 15+ completed projects

---

*Built with ❤️ using modern web technologies and best practices.*
