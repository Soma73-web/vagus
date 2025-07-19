# NEET Academy - Setup Instructions

## 🚀 Quick Setup Guide

### 1. Environment Setup

#### Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database Configuration
DB_NAME=neet_academy
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration (generate a secure secret)
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Configuration
ADMIN_EMAIL=admin@neetacademy.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=NEET Academy Admin

# OpenAI Configuration (optional, for AI chatbot)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

#### Frontend Environment Variables

```bash
cd client
cp .env.example .env
```

Edit `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_WHATSAPP_NUMBER=919876543210
REACT_APP_WHATSAPP_MESSAGE=Hello! I am interested in NEET coaching.
```

### 2. Database Setup

1. Create MySQL database:

```sql
CREATE DATABASE neet_academy;
```

2. Run the provided SQL script:

```bash
mysql -u your_username -p neet_academy < database_setup.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run create-admin  # Creates initial admin user
npm start
```

### 4. Frontend Setup

```bash
cd client
npm install
npm start
```

## 🔧 Configuration Details

### Admin Authentication

- **Database Connected**: Admin credentials are now stored in database
- **Auto-logout**: 30 minutes of inactivity triggers automatic logout
- **JWT Tokens**: Secure token-based authentication

### WhatsApp Integration

- Floating WhatsApp button on all pages
- Configurable phone number and default message
- Click-to-chat functionality

### AI Chatbot

- OpenAI-powered NEET question solver
- Floating chatbot button (left side)
- Contextual responses for NEET preparation
- Requires OpenAI API key configuration

### Events Management

- New Events tab in admin panel
- Image upload support
- Date management
- Full CRUD operations

## 🎯 Features Added

### 1. Database-Connected Admin Authentication ✅

- JWT-based authentication
- 30-minute auto-logout on inactivity
- Secure password hashing with bcrypt
- Activity tracking

### 2. Events Management ✅

- Admin panel integration
- Image upload capability
- Date and description management
- Complete CRUD operations

### 3. WhatsApp Integration ✅

- Floating WhatsApp button
- Customizable phone number and message
- Professional widget design

### 4. AI Chatbot ✅

- OpenAI integration
- NEET-focused responses
- Chat history
- Error handling

### 5. Form Management ✅

- No page refresh after add/edit operations
- Proper form reset functionality
- Better user experience

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Activity-based session management
- Environment variable configuration
- Secure API endpoints

## 📱 UI Improvements

- Responsive design
- Professional floating buttons
- Smooth animations
- Better admin panel layout
- Improved user experience

## 🛠️ Development Commands

### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run create-admin  # Create initial admin user
```

### Frontend

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🔧 Troubleshooting

### Admin Login Issues

1. Ensure you've created the initial admin: `npm run create-admin`
2. Check database connection
3. Verify JWT_SECRET is set

### Chatbot Not Working

1. Add OPENAI_API_KEY to backend .env
2. Check API key validity
3. Verify network connectivity

### WhatsApp Button Not Showing

1. Check REACT_APP_WHATSAPP_NUMBER in client .env
2. Verify component is imported in App.jsx

## 🔄 Migration from Old System

The new system maintains backward compatibility while adding new features:

1. **Old admin login** → **New database authentication**
2. **Manual event management** → **Admin panel with image uploads**
3. **Basic forms** → **Smart forms with no refresh**
4. **No chat support** → **WhatsApp + AI chatbot**

## 📊 Default Credentials

After running `npm run create-admin`:

- **Email**: admin@neetacademy.com (or from ADMIN_EMAIL env var)
- **Password**: admin123 (or from ADMIN_PASSWORD env var)

⚠️ **Important**: Change default credentials after first login!

## 🌟 Production Deployment

1. Update environment variables for production
2. Use strong JWT secret
3. Configure proper database credentials
4. Set up SSL certificates
5. Configure domain and CORS settings

## 📞 Support

For any issues or questions:

1. Check the troubleshooting section
2. Review environment variable configuration
3. Ensure all dependencies are installed
4. Check database connectivity

---

**Happy Coding! 🚀**
