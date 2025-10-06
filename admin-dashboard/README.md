# Portfolio Admin Dashboard

Modern admin dashboard built with React, Vite, and TailwindCSS.

## Features

✨ **Dashboard Overview** - Stats and quick actions
📝 **Projects Management** - Full CRUD operations
👤 **Personal Info Editor** - Update profile and hero section
🎓 **About Section** - Manage experience and education
🎯 **Skills Manager** - Add/edit/delete skills with percentages
📧 **Contact Manager** - Update contact info
💬 **Messages Inbox** - View contact form submissions
⚙️ **Settings** - Configure theme and SEO

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dashboard will open at http://localhost:5174/

## Default Login

- Email: admin@portfolio.com
- Password: Admin@123456

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **Vite** - Build tool

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/      # Reusable components
│   │   └── DashboardLayout.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── PersonalInfo.jsx
│   │   ├── AboutPage.jsx
│   │   ├── SkillsPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── MessagesPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Key Features

### Projects Management

- Create, read, update, delete projects
- Upload project images
- Filter by category
- Set featured projects
- Add technologies
- External links

### Personal Information

- Update name, title, bio
- Upload profile image
- Configure typewriter texts
- Edit hero section stats

### Skills Management

- Add/edit/delete skills
- Set skill percentages
- Organize by categories
- Reorder skills

### Messages Inbox

- View all contact messages
- Mark as read/unread
- Delete messages
- View message details

### Settings

- Theme colors
- SEO settings
- Site configuration

## API Integration

The dashboard communicates with the backend API using Axios.

All API calls are in `src/services/api.js`:

```javascript
import { projectsAPI, personalAPI, skillsAPI, etc } from './services/api'

// Example usage
const projects = await projectsAPI.getAll()
const project = await projectsAPI.create(data)
const updated = await projectsAPI.update(id, data)
await projectsAPI.delete(id)
```

## Authentication

JWT token is stored in localStorage:

```javascript
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
```

Protected routes redirect to login if no token exists.

## Styling

TailwindCSS with custom utility classes:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger button
- `.card` - Card container
- `.input` - Input field
- `.label` - Form label

## Build & Deploy

```bash
# Build for production
npm run build

# Output in dist/ folder
```

Deploy to:
- Vercel (Recommended)
- Netlify
- GitHub Pages
- Any static hosting

## Development Tips

### Adding New Page

1. Create page in `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Add menu item in `DashboardLayout.jsx`
4. Add API functions in `services/api.js`

### Hot Module Replacement

Vite provides instant updates during development. Changes reflect immediately without full page reload.

### TypeScript (Optional)

To add TypeScript:

```bash
npm install -D typescript @types/react @types/react-dom
```

Rename `.jsx` files to `.tsx`

## Troubleshooting

**Dashboard shows blank page:**
- Check browser console for errors
- Verify backend is running
- Check API URL in .env.local

**Can't login:**
- Verify credentials
- Check backend is running
- Open DevTools Network tab for API errors

**Images won't upload:**
- Check Cloudinary configuration in backend
- Verify file size (max 5MB)
- Check browser console for errors

## Performance

- Code splitting with React Router
- Lazy loading components
- React Query caching
- Optimized builds with Vite

## Security

- JWT authentication
- Protected routes
- Token expiration handling
- CORS configuration
- Input sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
