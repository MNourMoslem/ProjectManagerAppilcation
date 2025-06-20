# TeamWork – Project Management App (Web Frontend)

> **TeamWork** is a modern, full-featured project management application for teams, built for both web and mobile. This README covers the **web frontend** (React + TypeScript + Vite) – a beautiful, fast, and highly interactive interface for managing projects, tasks, teams, and more.

---

## 🚀 Features

- **Project & Task Management**: Create, edit, filter, and track projects and tasks with rich metadata (status, priority, due dates, tags, etc.).
- **Team Collaboration**: Invite members, assign roles, and collaborate on tasks and projects.
- **Dashboard & Analytics**: Get a bird's-eye view of your work with stats, urgent tasks, upcoming deadlines, and recent activity.
- **Advanced Filtering**: Filter tasks by status, priority, project, and more. Paginated and grid/list views.
- **Notifications & Alerts**: Real-time toast notifications for actions, errors, and updates.
- **Responsive & Accessible**: Fully responsive, dark mode support, keyboard navigation, and accessible components.
- **Reusable UI Components**: Modular design system with buttons, dropdowns, cards, tables, modals, and more.
- **Modern Forms**: Robust validation, dynamic member selection, and tag inputs for projects and tasks.
- **State Management**: Powered by [Zustand](https://github.com/pmndrs/zustand) for fast, scalable, and simple state management.
- **TypeScript Strictness**: 100% typed, strict mode enabled for reliability and maintainability.

---

## 📸 Screenshots

![4](https://github.com/user-attachments/assets/8e3ba233-89d1-4cee-9795-985321dc9f50)
![3](https://github.com/user-attachments/assets/427b7ec0-de48-40a2-a629-f7702f9ab3f1)
![2](https://github.com/user-attachments/assets/e32655ea-f240-4984-b14f-6cc60c2a6ff8)
![1](https://github.com/user-attachments/assets/d44d5f4d-8318-4193-af76-65f911eec42d)
![5](https://github.com/user-attachments/assets/6ceac53a-60d2-40a3-91c3-825270c4baca)


---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (dark mode enabled)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP:** [Axios](https://axios-http.com/)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **Linting:** [ESLint](https://eslint.org/) (with React/TypeScript plugins)

---

## 📁 Folder Structure

```
src/
  api/           # API utilities for backend communication
  assets/        # Static assets (images, SVGs)
  components/    # Reusable UI components (buttons, cards, forms, modals, etc.)
  guards/        # Route guards for authentication
  interfaces/    # TypeScript interfaces for data models
  routes/        # App pages and route definitions
  store/         # Zustand stores for state management
  index.tsx      # App entry point
  App.tsx        # Main app shell (layout, navigation, theming)
```

---

## 🧩 Key Concepts & Architecture

### State Management
- Uses **Zustand** for global state (projects, tasks, auth, notifications).
- All stores are typed and colocated in `src/store/`.

### UI/UX & Design System
- **Reusable Components:** Buttons, dropdowns, cards, tables, modals, notifications, etc.
- **Dark Mode:** Toggleable, persists user preference.
- **Accessibility:** Keyboard navigation, ARIA labels, focus states.

### Forms & Validation
- **Project & Task Forms:** Robust validation, dynamic fields, member selection, tag input, date pickers.
- **Modals:** For project/task creation, editing, and confirmations.

### Notifications
- **ToastProvider:** Real-time, auto-dismissing toasts for feedback (success, error, info, warning).

### Customization
- **Tailwind CSS:** Easily customize theme, colors, fonts in `tailwind.config.js`.
- **Component Props:** All UI components are highly configurable via props.

---

## ⚡ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App (Development)

```bash
npm run dev
```

- App runs at [http://localhost:5173](http://localhost:5173) by default.

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

---

## 📝 Customization & Theming
- Edit `tailwind.config.js` for theme changes (colors, fonts, breakpoints).
- All components support dark mode and are easily themeable.
- Add your own components in `src/components/` and pages in `src/routes/`.

---

## 🤝 Contributing

1. Fork the repo & clone your fork.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request!

---

## 📄 License

[MIT](../LICENSE)

---

> _TeamWork is built with ❤️ for teams who want to get things done, together._
