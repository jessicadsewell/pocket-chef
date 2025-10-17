# ✅ Supabase SDK Setup

## What's Been Added

✨ **Supabase SDK** is integrated alongside TypeORM

### New Files:

- `src/supabase/supabase.service.ts` - Full-featured Supabase service
- `src/supabase/supabase.module.ts` - NestJS module
- `src/supabase/USAGE_EXAMPLES.md` - Complete usage examples

### Updated Files:

- `src/app.module.ts` - Imports SupabaseModule
- `.env` - Added Supabase credentials

## 🚀 Quick Start

### 1. Get Your Supabase Credentials

Go to [https://app.supabase.com](https://app.supabase.com):

1. Select your project
2. Go to **Settings** → **API**
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (secret!)
```

### 2. Update `.env` File

Edit `apps/backend/.env`:

```bash
# Supabase API
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Restart Your Server

```bash
cd apps/backend
npm run start:dev
```

You should see:

```
✅ Supabase SDK initialized
```

## 📚 How to Use

### Authentication

```typescript
constructor(private supabaseService: SupabaseService) {}

// Sign up
await this.supabaseService.signUp(email, password);

// Sign in
await this.supabaseService.signIn(email, password);

// Get user
await this.supabaseService.getUser(accessToken);
```

### File Storage

```typescript
// Upload file
await this.supabaseService.uploadFile('recipe-images', 'path/file.jpg', buffer);

// Get public URL
const url = this.supabaseService.getPublicUrl('recipe-images', 'path/file.jpg');

// Delete file
await this.supabaseService.deleteFile('recipe-images', 'path/file.jpg');
```

### Realtime Updates

```typescript
// Subscribe to table changes
this.supabaseService.subscribeToTable('meal_plan', (payload) => {
  console.log('Meal plan changed!', payload);
});

// Subscribe to specific row
this.supabaseService.subscribeToRow('meal_plan', 'id', 123, (payload) => {
  console.log('This meal plan changed!', payload);
});
```

## 🏗️ Architecture

```
Your App
├── TypeORM          → Database queries (Users, Recipes, etc.)
└── Supabase SDK     → Auth, Storage, Realtime
    └── Both use the same PostgreSQL database!
```

## 📖 Full Documentation

See `src/supabase/USAGE_EXAMPLES.md` for:

- ✅ Complete authentication examples
- ✅ File upload/download examples
- ✅ Realtime subscription examples
- ✅ Combined TypeORM + Supabase patterns
- ✅ Frontend integration examples

## ⚙️ Optional: Create Storage Buckets

In Supabase Dashboard:

1. Go to **Storage**
2. Click **Create Bucket**
3. Create these buckets:
   - `recipe-images` (public)
   - `meal-plan-images` (public)
   - `user-avatars` (public)

## 🎯 Next Steps

1. **Replace JWT Auth** with Supabase Auth (optional)
2. **Add image uploads** for recipes/meal plans
3. **Enable realtime** for live updates
4. **Add Row Level Security** in Supabase dashboard

## 🆘 Troubleshooting

### "Supabase URL or Key not configured"

- Check your `.env` file has the correct values
- Restart your server after updating `.env`

### "Supabase client not initialized"

- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Check for typos in environment variable names

### Storage upload fails

- Create the bucket in Supabase Dashboard first
- Make sure bucket is set to public if you need public URLs

## 💡 Tips

- Use **TypeORM** for complex queries and relations
- Use **Supabase SDK** for auth, storage, and realtime
- The `service_role` key has admin access - keep it secret!
- The `anon` key is safe to use on frontend

Enjoy your new superpowers! 🚀
