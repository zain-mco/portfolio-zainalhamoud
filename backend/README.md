# Portfolio Backend API

Node.js + Express + MongoDB backend for portfolio management.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Edit .env with your configuration

# Seed database with initial data
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Routes

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- GET `/api/auth/me` - Get current user

### Personal Info
- GET `/api/personal` - Get personal info
- PUT `/api/personal` - Update (Protected)

### Projects
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create (Protected)
- PUT `/api/projects/:id` - Update (Protected)
- DELETE `/api/projects/:id` - Delete (Protected)

### Skills
- GET `/api/skills` - Get all skills
- POST `/api/skills` - Create (Protected)
- PUT `/api/skills/:id` - Update (Protected)
- DELETE `/api/skills/:id` - Delete (Protected)

### About
- GET `/api/about` - Get about section
- PUT `/api/about` - Update (Protected)

### Contact
- GET `/api/contact` - Get contact info
- POST `/api/contact/messages` - Submit message
- GET `/api/contact/messages` - Get messages (Protected)

### Settings
- GET `/api/settings` - Get settings
- PUT `/api/settings` - Update (Protected)

## Default Admin Credentials

After running `npm run seed`:

- Email: admin@portfolio.com
- Password: Admin@123456

**⚠️ Change these in production!**

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # Temporary file storage
├── server.js        # Express app entry point
└── package.json     # Dependencies
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- multer - File uploads
- cloudinary - Image hosting
- helmet - Security headers
- express-rate-limit - Rate limiting

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## Testing

Test the API health:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```
