# Supabase Setup Guide for PocketChef

## 📋 Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project

## 🔧 Step-by-Step Setup

### 1. Get Supabase Database Credentials

Go to your Supabase project dashboard:

1. Click on **Settings** (⚙️) in the left sidebar
2. Click on **Database**
3. Scroll down to **Connection string** section
4. Select **URI** mode and copy the connection details

You'll need:

- **Host**: `db.xxxxxxxxxxxx.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: The password you set when creating the project

### 2. Create `.env` File

Create a `.env` file in `apps/backend/` with these values:

```bash
# Application
NODE_ENV=development
PORT=3000

# Supabase Database Connection
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-db-password
DB_NAME=postgres
DB_SSL=true

# Supabase API (Optional - for additional features)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# LLM Configuration
LLM_PROVIDER=openai
LLM_API_KEY=your-openai-or-anthropic-api-key
LLM_MODEL=gpt-4o

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Get Supabase API Keys (Optional)

If you want to use Supabase features like Auth, Storage, Realtime:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_KEY` (keep this secret!)

### 4. Connection String Format

**Direct Connection (Pooler)**:

```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

**Session Mode (Recommended for TypeORM)**:

```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
```

### 5. Enable SSL

Supabase requires SSL connections. This is already configured in `app.module.ts`:

```typescript
ssl: configService.get('DB_SSL') === 'true'
  ? { rejectUnauthorized: false }
  : false;
```

## 🚀 Running the Application

1. Make sure your `.env` file is configured
2. Start the backend:

   ```bash
   cd apps/backend
   npm run start:dev
   ```

3. TypeORM will automatically create tables on first run (synchronize: true)

## 📊 Viewing Your Database

Access your Supabase database:

1. Go to **Database** → **Tables** in Supabase dashboard
2. You'll see tables: `user`, `quiz_response`, `meal_plan`, `recipe`, `ingredient`
3. Use the **SQL Editor** to run queries

## 🔐 Security Best Practices

### For Development:

- Use the pooler connection (port 6543) for better performance
- Keep SSL enabled
- Use `synchronize: true` for auto-schema updates

### For Production:

- Set `NODE_ENV=production`
- Set `synchronize: false` (use migrations instead)
- Use Supabase Connection Pooling
- Enable Row Level Security (RLS) in Supabase

## 🎯 Next Steps: Optional Supabase Features

### 1. Use Supabase Auth (Instead of JWT)

Replace your custom JWT auth with Supabase Auth:

```typescript
// Install
npm install @supabase/supabase-js

// Create supabase.service.ts
import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }
}
```

### 2. Use Supabase Realtime

For real-time updates on meal plans:

```typescript
const channel = supabase
  .channel('meal-plans')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'meal_plan' },
    (payload) => console.log(payload),
  )
  .subscribe();
```

### 3. Use Supabase Storage

For recipe images:

```typescript
const { data, error } = await supabase.storage
  .from('recipe-images')
  .upload('public/recipe-1.jpg', file);
```

## 📝 Migration from Local PostgreSQL

If you have existing data:

1. **Export from local**:

   ```bash
   pg_dump -U PocketChef -d PocketChef > backup.sql
   ```

2. **Import to Supabase**:
   - Go to **SQL Editor** in Supabase
   - Paste and run your SQL backup
   - Or use: `psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql`

## 🆘 Troubleshooting

### Can't connect to database

- Check firewall settings
- Verify SSL is enabled (`DB_SSL=true`)
- Try the direct connection first (port 5432)
- Check password is correct

### Tables not created

- Ensure `synchronize: true` in development
- Check TypeORM logs for errors
- Manually create tables in Supabase SQL Editor

### SSL/TLS errors

- Add `?sslmode=require` to connection string
- Check `ssl: { rejectUnauthorized: false }` in config

### Connection pooling issues

- Use port 6543 for pooled connections
- Use port 5432 for direct connections
- Supabase limits: 60 direct connections

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [TypeORM Supabase Guide](https://supabase.com/docs/guides/integrations/typeorm)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
