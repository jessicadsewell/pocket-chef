import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QuizResponse } from './entities/quiz-response.entity';
import { MealPlan } from './entities/meal-plan.entity';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'PocketChef',
      password: 'PocketChef',
      database: 'PocketChef',
      entities: [User, QuizResponse, MealPlan, Recipe, Ingredient],
      synchronize: true, // Set to false in production
    }),
    TypeOrmModule.forFeature([
      User,
      QuizResponse,
      MealPlan,
      Recipe,
      Ingredient,
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [UserService],
})
export class AppModule {}
