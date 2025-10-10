# 🍳 PocketChef

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
