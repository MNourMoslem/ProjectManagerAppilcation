# TeamWork Backend

A Node.js/Express backend for the TeamWork project management application.

## 🚀 Deployment on Render.com

### Prerequisites
1. MongoDB Atlas account (free tier available)
2. Mailtrap account for email services
3. GitHub repository

### Environment Variables for Render

Set these environment variables in your Render dashboard:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=teamwork
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-key
MAILTRAP_API_TOKEN=your-mailtrap-api-token
CLIENT_URL=https://your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com,https://your-mobile-app.com,https://your-render-app.onrender.com
```

### Deployment Steps

1. **Set up MongoDB Atlas:**
   - Create a free MongoDB Atlas account
   - Create a cluster and get your connection string
   - Replace `username`, `password`, and `cluster` in the MONGO_URI

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Set Root Directory to: `web/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set environment variables as listed above

3. **Update Frontend:**
   - Update your frontend API base URL to point to your Render backend URL

## 🛠️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your local values

4. Start development server:
   ```bash
   npm run dev
   ```

## 📦 Features

- Authentication with JWT
- Project and task management
- Real-time notifications
- Email notifications via Mailtrap
- CORS configuration for multiple origins
- Scheduled jobs for deadline notifications

## 🔧 Environment Variables

- `MONGO_URI`: MongoDB connection string (without database name)
- `DB_NAME`: Database name (default: teamwork)
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment mode (development/production)
- `JWT_SECRET`: Secret key for JWT token generation
- `MAILTRAP_API_TOKEN`: API token for Mailtrap email service
- `CLIENT_URL`: Frontend application URL
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins
