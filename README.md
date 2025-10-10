# 🍳 Pocket Chef

A modern meal planning application built with Inertia.js, allowing users to plan meals, discover recipes, and manage their weekly menu with ease.

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Inertia.js** - Modern monolith architecture
- **Tailwind CSS** - Utility-first styling
- **Headless UI** - Accessible UI components
- **Remix Icons** - Beautiful icon library
- **Vite** - Fast build tool

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## ✨ Features

- 🔐 **User Authentication** - Register, login, and secure sessions
- 📋 **Meal Planning** - Create and manage weekly meal plans
- 🍽️ **Recipe Browser** - Browse and search recipes
- 📝 **Personalized Quiz** - Get meal recommendations based on preferences
- 🎨 **Modern UI** - Beautiful dark-themed navbar with responsive design
- ⚡ **SPA Experience** - Smooth navigation with Inertia.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Docker (optional, for database)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pocket-chef.git
cd pocket-chef
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up the database
```bash
# Using Docker (recommended)
docker-compose up -d

# Or configure your own PostgreSQL and update connection settings in:
# apps/backend/src/app.module.ts
```

### 4. Configure environment variables
Create a `.env` file in `apps/backend/`:
```env
JWT_SECRET=your-secret-key-here
PORT=3000
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev
```
Backend runs on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```
Vite dev server runs on http://localhost:5173

**Access the app at:** http://localhost:3000 ⚠️ (Backend, not 5173!)

### Production Build

```bash
# Build backend
cd apps/backend
npm run build

# Build frontend
cd apps/frontend
npm run build
```

## 📁 Project Structure

```
pocket-chef/
├── apps/
│   ├── backend/           # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── entities/  # TypeORM entities
│   │   │   ├── types/     # TypeScript types
│   │   │   └── views/     # Inertia HTML templates
│   │   └── package.json
│   └── frontend/          # React frontend
│       ├── src/
│       │   ├── Pages/     # Inertia pages
│       │   ├── components/# React components
│       │   └── main.tsx   # App entry point
│       └── package.json
├── docker-compose.yml     # PostgreSQL container
└── README.md
```

## 🔑 Key Concepts

### Inertia.js Architecture
- **Server-side routing** - All routes defined in backend
- **No API needed** - Data passed directly to components
- **SPA experience** - Smooth navigation without full page reloads
- **Shared authentication** - Auth state automatically available on all pages

### How It Works
1. Visit http://localhost:3000 (backend serves HTML)
2. Backend renders Inertia page with data
3. Vite serves hot-reloading JS/CSS assets
4. Navigation uses Inertia Link components
5. Form submissions handled by Inertia

## 🛣️ Available Routes

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/recipes` - Browse recipes
- `/meal-plans` - View meal plans (requires auth)
- `/quiz` - Meal planning quiz

## 🎨 Components

### NavBar
- Responsive dark-themed navigation
- User dropdown menu with profile/settings/logout
- Mobile hamburger menu
- Logo with gradient icon

### Icon
- Remix Icons integration
- Size presets (xs, sm, md, lg, xl, 2xl, 3xl)
- Custom className support

### Modal
- Headless UI Dialog component
- Confirmation modal with customizable title/message
- Dark theme styling

## 🔧 Development Tips

1. **Always access via backend (port 3000)**, not Vite server (5173)
2. **Tailwind classes** are processed by PostCSS
3. **Hot reload** works automatically with Vite
4. **Database changes** auto-sync with TypeORM (in dev)

## 📝 TODO

- [ ] Implement full recipe CRUD
- [ ] Add meal plan generation from quiz
- [ ] User profile management
- [ ] Shopping list generation
- [ ] Recipe search and filters
- [ ] Image uploads for recipes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Author

Built with ❤️ using Inertia.js

---

**Happy Cooking! 🍽️**

