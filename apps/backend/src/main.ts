import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { customInertiaMiddleware } from './custom-inertia';
import type { Request } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Inertia',
      'X-Inertia-Version',
      'X-Requested-With',
    ],
  });

  // Global ValidationPipe for DTOs (supports class-validator)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Inertia middleware (must come before other middleware)
  app.use(customInertiaMiddleware);

  // Authentication middleware to set req.user and share auth data with Inertia
  const supabaseService = app.get(SupabaseService);
  app.use(async (req: Request, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const userResponse = await supabaseService.getUser(token);
        if (userResponse.data?.user) {
          const user = userResponse.data.user;
          req.user = {
            id: parseInt(user.id),
            name: user.user_metadata?.name || user.email,
            email: user.email,
          };
          // Share authenticated user data with all Inertia pages
          res.inertia.share({
            auth: {
              user: {
                id: user.id,
                name: user.user_metadata?.name || user.email,
                email: user.email,
              },
            },
          });
        } else {
          req.user = undefined;
          res.inertia.share({ auth: null });
        }
      } catch (error) {
        req.user = undefined;
        res.inertia.share({ auth: null });
      }
    } else {
      res.inertia.share({ auth: null });
    }
    next();
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
