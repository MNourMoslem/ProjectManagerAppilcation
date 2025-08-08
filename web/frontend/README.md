# TeamWork Frontend

A React/TypeScript frontend application for the TeamWork project management system built with Vite, Tailwind CSS, and Zustand for state management.

## 🚀 Deployment

### Render.com Deployment

1. **Environment Variables**
   Set these in your Render dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=TeamWork
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=production
   ```

2. **Build Settings**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18` or `20`

### Vercel Deployment

1. **Connect your GitHub repository**
2. **Set Environment Variables** in Vercel dashboard
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Netlify Deployment

1. **Connect your GitHub repository**
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Set Environment Variables** in Netlify dashboard

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your local backend URL.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📦 Features

- **Authentication**: User registration, login, password reset
- **Project Management**: Create, edit, delete projects
- **Task Management**: Create, assign, track tasks
- **Real-time Notifications**: Get notified of important updates
- **Email System**: Send and receive project-related emails
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes (if implemented)

## 🏗️ Architecture

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.teamwork.com/api` |
| `VITE_APP_NAME` | Application name | `TeamWork` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_NODE_ENV` | Environment mode | `production` |

## 📁 Project Structure

```
src/
├── api/           # API utility functions
├── assets/        # Static assets
├── auth/          # Authentication components
├── components/    # Reusable UI components
├── guards/        # Route protection components
├── interfaces/    # TypeScript interfaces
├── routes/        # Route definitions
├── store/         # Zustand state management
└── main.tsx       # App entry point
```

## 🔐 Security

- Environment variables are used for all configuration
- API calls include proper authentication headers
- CORS is handled by the backend
- No sensitive data is stored in local storage (only tokens)

## 🚀 Performance Optimizations

- Code splitting with manual chunks
- Minification with Terser
- Tree shaking for unused code
- Optimized build configuration
- Lazy loading of components

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 🤝 Development Guidelines

1. Use TypeScript for all new code
2. Follow the existing component structure
3. Use Tailwind CSS classes for styling
4. Add proper error handling for API calls
5. Update interfaces when adding new data structures
