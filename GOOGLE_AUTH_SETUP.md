# Google Authentication Setup for TravelGrid

## Prerequisites
- Google Cloud Console account
- Node.js and npm installed
- MongoDB database running

## Step 1: Create Google OAuth 2.0 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
5. Copy the Client ID

## Step 2: Update the Application

1. Replace `YOUR_GOOGLE_CLIENT_ID` in `client/src/main.jsx` with your actual Google Client ID:

```jsx
<GoogleOAuthProvider clientId="your-actual-google-client-id-here">
```

## Step 3: Start the Backend Server

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Step 4: Start the Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features Added

### Frontend
- ✅ Google authentication buttons in navbar
- ✅ Google login/signup on Login page
- ✅ Google login/signup on Signup page
- ✅ Google OAuth provider setup
- ✅ Custom Google login component

### Backend
- ✅ Google authentication endpoint (`/api/auth/google`)
- ✅ Updated User model with Google fields
- ✅ Google user creation and login logic
- ✅ JWT token generation for Google users

## How It Works

1. User clicks "Continue with Google" button
2. Google OAuth popup opens
3. User authenticates with Google
4. Frontend receives Google credentials
5. Frontend sends user data to backend
6. Backend creates/updates user in database
7. Backend returns JWT token
8. Frontend stores user session and redirects

## Security Features

- ✅ Email validation
- ✅ JWT token authentication
- ✅ Secure password hashing (for non-Google users)
- ✅ Google ID verification
- ✅ User session management

## Environment Variables

Make sure to set these environment variables in your backend:

```env
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
```

## Testing

1. Start both frontend and backend servers
2. Navigate to `http://localhost:5173`
3. Click "Login" or "Sign Up"
4. Click "Continue with Google"
5. Complete Google authentication
6. Verify user is logged in and redirected

## Troubleshooting

- **"Invalid Client ID"**: Make sure you've replaced `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID
- **"Origin not allowed"**: Add `http://localhost:5173` to authorized origins in Google Cloud Console
- **"Database connection error"**: Ensure MongoDB is running and connection string is correct
- **"JWT_SECRET not set"**: Set the JWT_SECRET environment variable in your backend 