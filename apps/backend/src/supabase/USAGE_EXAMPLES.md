# Supabase SDK Usage Examples

## Setup Complete! ✅

The Supabase SDK is now integrated alongside TypeORM. Here's how to use it:

## 1. Authentication Example

Replace your JWT auth with Supabase Auth:

```typescript
// auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(private supabaseService: SupabaseService) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
  ) {
    const { data, error } = await this.supabaseService.signUp(
      body.email,
      body.password,
      { name: body.name }, // metadata
    );

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { data, error } = await this.supabaseService.signIn(
      body.email,
      body.password,
    );

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      accessToken: data.session?.access_token,
    };
  }

  @Post('logout')
  async logout() {
    await this.supabaseService.signOut();
    return { message: 'Logged out successfully' };
  }
}
```

## 2. File Storage Example

Upload recipe images:

```typescript
// recipes/recipes.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RecipesService {
  constructor(private supabaseService: SupabaseService) {}

  async uploadRecipeImage(recipeId: number, file: Express.Multer.File) {
    const fileName = `recipes/${recipeId}/${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await this.supabaseService.uploadFile(
      'recipe-images', // bucket name
      fileName,
      file.buffer,
      {
        contentType: file.mimetype,
        upsert: true,
      },
    );

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const publicUrl = this.supabaseService.getPublicUrl(
      'recipe-images',
      fileName,
    );

    return {
      path: data.path,
      url: publicUrl,
    };
  }

  async deleteRecipeImage(path: string) {
    const { error } = await this.supabaseService.deleteFile(
      'recipe-images',
      path,
    );

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}
```

## 3. Realtime Updates Example

Subscribe to meal plan changes:

```typescript
// meal-plans/meal-plans.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SupabaseService } from '../supabase/supabase.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class MealPlansGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private supabaseService: SupabaseService) {}

  onModuleInit() {
    // Subscribe to meal plan changes
    this.supabaseService.subscribeToTable(
      'meal_plan',
      (payload) => {
        // Emit to all connected clients
        this.server.emit('mealPlanUpdate', {
          event: payload.eventType,
          data: payload.new,
          old: payload.old,
        });
      },
      '*', // Listen to all events (INSERT, UPDATE, DELETE)
    );
  }

  // Subscribe to specific user's meal plans
  subscribeToUserMealPlans(userId: number) {
    return this.supabaseService.subscribeToRow(
      'meal_plan',
      'user_id',
      userId,
      (payload) => {
        this.server.emit(`user:${userId}:mealPlans`, {
          event: payload.eventType,
          data: payload.new,
        });
      },
    );
  }
}
```

## 4. Combined TypeORM + Supabase Example

```typescript
// meal-plans/meal-plans.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entities/meal-plan.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MealPlansService {
  constructor(
    // TypeORM for database operations
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,

    // Supabase for extras
    private supabaseService: SupabaseService,
  ) {}

  async createMealPlan(
    userId: number,
    data: any,
    coverImage?: Express.Multer.File,
  ) {
    // 1. Save to database using TypeORM
    const mealPlan = this.mealPlanRepository.create({
      name: data.name,
      userId,
      schedule: data.schedule,
    });

    const savedMealPlan = await this.mealPlanRepository.save(mealPlan);

    // 2. Upload cover image using Supabase Storage
    if (coverImage) {
      const { url } = await this.uploadCoverImage(savedMealPlan.id, coverImage);
      savedMealPlan.coverImageUrl = url;
      await this.mealPlanRepository.save(savedMealPlan);
    }

    return savedMealPlan;
  }

  private async uploadCoverImage(
    mealPlanId: number,
    file: Express.Multer.File,
  ) {
    const fileName = `meal-plans/${mealPlanId}/cover.jpg`;

    await this.supabaseService.uploadFile(
      'meal-plan-images',
      fileName,
      file.buffer,
      { contentType: file.mimetype, upsert: true },
    );

    return {
      url: this.supabaseService.getPublicUrl('meal-plan-images', fileName),
    };
  }
}
```

## 5. Create Storage Buckets

Run this once to create buckets:

```typescript
// scripts/setup-storage.ts
import { SupabaseService } from '../src/supabase/supabase.service';

async function setupStorage() {
  const supabase = new SupabaseService(/* configService */);

  // Create buckets
  await supabase.createBucket('recipe-images', { public: true });
  await supabase.createBucket('meal-plan-images', { public: true });
  await supabase.createBucket('user-avatars', { public: true });

  console.log('✅ Storage buckets created');
}
```

Or create them in Supabase Dashboard → Storage → Create Bucket

## 6. Frontend Integration

Use Supabase on frontend for realtime:

```typescript
// frontend/src/hooks/useMealPlanRealtime.ts
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function useMealPlanRealtime(userId: number) {
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel('meal-plan-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plan',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Meal plan updated!', payload);
          // Update state
          if (payload.eventType === 'INSERT') {
            setMealPlans((prev) => [...prev, payload.new]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return mealPlans;
}
```

## Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_KEY`

Update your `.env` file with these values!

## Benefits

✅ **Authentication** - Built-in auth with email, OAuth, magic links  
✅ **Storage** - Upload images, files with CDN  
✅ **Realtime** - Live updates across clients  
✅ **TypeORM** - Still use TypeORM for complex queries  
✅ **RLS** - Row Level Security for data protection

## Learn More

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
