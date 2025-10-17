import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QuizResponse } from './entities/quiz-response.entity';
import { MealPlan } from './entities/meal-plan.entity';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10) || 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, QuizResponse, MealPlan, Recipe, Ingredient],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl:
          configService.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      QuizResponse,
      MealPlan,
      Recipe,
      Ingredient,
    ]),
    AuthModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [UserService],
})
export class AppModule {}
