# TravelGrid Environment Setup Guide

This guide will help you set up the environment variables for both the frontend and backend of the TravelGrid application with email verification functionality.

## 📋 Prerequisites

Before setting up the environment variables, make sure you have:

- Node.js installed (v16 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Gmail account with 2-factor authentication enabled
- Google Cloud Console account (for OAuth)

## 🔧 Backend Setup (.env)

### 1. Create the backend .env file
Create a `.env` file in the `Server` directory with the following variables:

### 2. Configure each variable in the `Server/.env` file:

#### Database Configuration
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/travelgrid
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/travelgrid
```

#### JWT Configuration
```env
# JWT Secret for authentication tokens
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
```
**Generate secure keys using:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

#### Email Configuration (Gmail SMTP)
```env
# Gmail SMTP Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM="TravelGrid <your_gmail_address@gmail.com>"

# SMTP Settings (Optional - defaults to Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Setting up Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-factor authentication
3. Generate an "App Password" for Mail
4. Use the generated 16-character password (not your regular Gmail password)

#### Google OAuth Configuration
```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Setting up Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google OAuth API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:5173`, `http://localhost:3000`
6. Copy the Client ID and Secret

#### Server Configuration
```env
# Server Settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🎨 Frontend Setup (.env)

### 1. Create the frontend .env file
Create a `.env` file in the `client` directory with the following variables:

### 2. Configure each variable in the `client/.env` file:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000

# Google OAuth Configuration (same Client ID as backend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google Gemini AI API (Optional - for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
VITE_APP_NAME=TravelGrid
VITE_APP_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

### 3. Optional AI Features Setup

If you want to use AI features like the Summarizer component:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini
3. Add it as `VITE_GEMINI_API_KEY` in your `.env` file

## 🚀 Getting Started

### 1. Install Dependencies

**Backend:**
```bash
cd Server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, just ensure your connection string is correct
```

### 3. Test Email Configuration (Backend)
```bash
cd Server
node test-email.js
```

Or use the simple test:
```bash
cd Server
node simple-test.js
```

### 4. Start the Application

**Backend (Terminal 1):**
```bash
cd Server
npm start
# or npm run dev for development with nodemon
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

## 📧 Complete Environment Variables Reference

### Backend (.env in Server directory):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/travelgrid

# Authentication
JWT_SECRET=your_jwt_secret_here

# Email (Gmail SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="TravelGrid <your_gmail@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env in client directory):
```env
# API
VITE_API_URL=http://localhost:5000

# OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# AI (Optional)
VITE_GEMINI_API_KEY=your_gemini_api_key

# App
VITE_APP_NAME=TravelGrid
VITE_APP_URL=http://localhost:5173
NODE_ENV=development
```

## 📧 Email Verification Features

The application now includes:
- ✅ Email verification on user registration
- ✅ Resend verification code functionality
- ✅ Email verification status in navbar
- ✅ Beautiful HTML email templates
- ✅ Verification code expiration (5 minutes)
- ✅ Automatic verification for Google OAuth users

## 🔒 Security Notes

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use strong JWT secrets** - Generate random 64-character strings
3. **Use Gmail App Passwords** - Never use your regular Gmail password
4. **Enable HTTPS in production** - Update URLs and security settings
5. **Rotate secrets regularly** - Especially in production environments

## 🐛 Troubleshooting

### Email Issues
- **Authentication failed**: Check Gmail app password and 2FA settings
- **Connection failed**: Verify SMTP settings and network connectivity
- **Rate limiting**: Gmail has sending limits for new accounts
- **Test email not received**: Check spam folder, verify EMAIL_USER and EMAIL_PASS

### OAuth Issues
- **Invalid client**: Check Google Client ID matches between frontend/backend
- **Origin not allowed**: Add your domains to Google Console authorized origins
- **Redirect URI mismatch**: Ensure callback URLs are configured correctly

### Database Issues
- **Connection failed**: Ensure MongoDB is running and connection string is correct
- **Authentication failed**: Check MongoDB Atlas credentials
- **Database not found**: Database will be created automatically on first connection

### Environment Variable Issues
- **Variables not loading**: Ensure `.env` files are in correct directories (Server/.env and client/.env)
- **CORS errors**: Check FRONTEND_URL matches your client development server
- **API not found**: Verify VITE_API_URL points to your backend server

### Development Issues
- **Hot reload not working**: Restart development servers after changing .env files
- **Build errors**: Check all required environment variables are set
- **Port conflicts**: Change PORT in backend .env if 5000 is already in use

## 📞 Support

If you encounter issues:
1. Check the browser console for frontend errors
2. Check server logs for backend errors
3. Verify all environment variables are set correctly
4. Test email configuration using the test script

## 📝 Quick Setup Commands

### Create Backend .env file:
```bash
# Navigate to Server directory
cd Server

# Create .env file (Windows)
echo. > .env

# Create .env file (Linux/Mac)
touch .env
```

### Create Frontend .env file:
```bash
# Navigate to client directory
cd client

# Create .env file (Windows)
echo. > .env

# Create .env file (Linux/Mac)
touch .env
```

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

**Happy coding! 🚀✨**
