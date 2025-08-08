# Production Deployment Debug Guide

## Current Issue
"Failed to load projects. Unauthorized - no token provided" error in production

## Root Cause Analysis
The issue is likely one of the following:

1. **Backend URL Mismatch**: Frontend trying to connect to wrong backend URL
2. **CORS Issues**: Backend not allowing requests from frontend domain
3. **Token Storage Issues**: localStorage not persisting between requests
4. **Environment Variables**: Missing or incorrect environment configuration

## Step-by-Step Debug Process

### 1. Update Environment Variables
**First, update your `.env` file with your actual backend URL:**

```bash
# In web/frontend/.env
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
VITE_NODE_ENV=production
```

### 2. Check Backend CORS Configuration
Make sure your backend `.env` includes your frontend domain:

```bash
# In web/backend/.env
CORS_ORIGINS=https://YOUR-FRONTEND-DOMAIN.vercel.app,https://YOUR-FRONTEND-DOMAIN.netlify.app
```

### 3. Test Authentication Flow
1. Deploy the updated frontend build to your hosting service
2. Open browser developer tools (F12)
3. Go to Console tab
4. Try to log in
5. Check the debug logs that will show:
   - API URLs being called
   - Token storage status
   - Request/response details

### 4. Use the Debug Test Page
I've created a test page at `dist/test-auth.html` that you can deploy alongside your app:

1. Update the API_URL in the test file to match your backend
2. Deploy it with your frontend
3. Visit `/test-auth.html` on your deployed site
4. Use the test buttons to debug authentication

### 5. Common Issues and Solutions

#### Issue: Wrong Backend URL
**Symptoms**: Network errors, 404s when trying to login
**Solution**: Update `VITE_API_URL` in `.env` file and rebuild

#### Issue: CORS Errors
**Symptoms**: CORS policy errors in browser console
**Solution**: Add your frontend domain to backend CORS_ORIGINS

#### Issue: Token Not Persisting
**Symptoms**: Token exists during login but disappears on page reload
**Solution**: Check if localStorage is being cleared by other scripts

#### Issue: Backend Token Validation
**Symptoms**: Token exists but backend says "no token provided"
**Solution**: Check if backend expects different header format

## Expected Debug Logs

When working correctly, you should see logs like:

```javascript
// During login:
Login successful, token stored: {
  hasToken: true,
  tokenPreview: "eyJhbGciOi...",
  localStorage: { authToken: true, token: false }
}

// During API calls:
API Call Debug: {
  endpoint: "/projects",
  hasToken: true,
  tokenSource: "auth-token",
  apiBaseUrl: "https://your-backend.onrender.com/api"
}

API Response Debug: {
  status: 200,
  ok: true,
  headers: {...}
}
```

## Next Steps

1. **Update .env file** with your actual backend URL
2. **Rebuild frontend**: `npm run build`
3. **Deploy updated build** to your hosting service
4. **Test authentication** and check browser console for debug logs
5. **Report back** with the debug logs if issue persists

## Files Modified for Debug

- `src/api/apiUtils.ts`: Added comprehensive request/response logging
- `src/store/authStore.ts`: Added token storage logging
- `.env`: Created with production environment variables
- `dist/test-auth.html`: Standalone auth testing tool

The debug logs will help us identify exactly where the authentication is failing in production.
