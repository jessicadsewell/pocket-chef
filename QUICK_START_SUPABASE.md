# 🚀 Quick Start: Supabase Setup

## What Changed

✅ Updated `app.module.ts` to use environment variables  
✅ Added Supabase support with TypeORM  
✅ Installed `@nestjs/config` and `@supabase/supabase-js`

## Next Steps (5 minutes)

### 1️⃣ Create Supabase Project

Go to [https://supabase.com](https://supabase.com) and:

- Sign up / Log in
- Click "New Project"
- Set project name: `pocketchef`
- Set database password (save this!)
- Choose region closest to you
- Click "Create Project" (takes ~2 minutes)

### 2️⃣ Get Database Credentials

Once your project is ready:

1. Go to **Settings** ⚙️ → **Database**
2. Find **Connection Info** section
3. Note these values:
   - Host: `db.xxxxxxxxxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (the one you set)

### 3️⃣ Create `.env` File

Create `apps/backend/.env`:

```bash
# Copy this template and fill in your values

NODE_ENV=development
PORT=3000

# Supabase Database (fill these in!)
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=postgres
DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRATION=7d

# LLM (if using AI features)
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Test Connection

```bash
cd apps/backend
npm run start:dev
```

You should see:

```
[Nest] TypeORM connected to database
Application is running on: http://localhost:3000
```

### 5️⃣ View Your Tables

Go to Supabase Dashboard → **Database** → **Tables**

You'll see your tables created automatically:

- `user`
- `quiz_response`
- `meal_plan`
- `recipe`
- `ingredient`

## 🎉 Done!

Your app is now using Supabase as the database!

## 💡 Tips

**View Data**: Use Supabase's **Table Editor** to see/edit data visually

**Run SQL**: Use **SQL Editor** for custom queries

**API Keys**: Get them from **Settings** → **API** for Supabase features

**Connection Issues?**: Check `apps/backend/SUPABASE_SETUP.md` for troubleshooting

## 📚 Full Documentation

See `apps/backend/SUPABASE_SETUP.md` for:

- Advanced configuration
- Supabase Auth integration
- Realtime features
- Storage for images
- Production deployment
- Migration guide
