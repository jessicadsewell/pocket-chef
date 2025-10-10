/**
 * Meal Plan Service - Integrates with the Meal Plan Agent
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MealPlan } from '../entities/meal-plan.entity';
import { QuizResponse } from '../entities/quiz-response.entity';
import { Recipe } from '../entities/recipe.entity';
import { User } from '../entities/user.entity';
import {
  createMealPlanAgent,
  MealPlanAgent,
  type MealPlanResponse,
  type MealRecipe,
} from '../agents/meal-plan.agent';
import type { MealPlanPromptData } from '../prompts/meal-plan.prompts';

@Injectable()
export class MealPlanService {
  private mealPlanAgent: MealPlanAgent;

  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    @InjectRepository(QuizResponse)
    private quizResponseRepository: Repository<QuizResponse>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    // Initialize the meal plan agent with your preferred LLM provider
    const provider = this.configService.get<'openai' | 'anthropic'>(
      'LLM_PROVIDER',
      'openai',
    );
    const apiKey = this.configService.get<string>('LLM_API_KEY');
    const model = this.configService.get<string>('LLM_MODEL');

    if (!apiKey) {
      throw new Error('LLM_API_KEY is not configured in environment variables');
    }

    this.mealPlanAgent = createMealPlanAgent(provider, apiKey, model);
  }

  /**
   * Generate a meal plan from a quiz response
   */
  async generateFromQuizResponse(
    quizResponseId: number,
    userId: number,
  ): Promise<MealPlan> {
    // Fetch the quiz response
    const quizResponse = await this.quizResponseRepository.findOne({
      where: { id: quizResponseId },
      relations: ['user'],
    });

    if (!quizResponse) {
      throw new Error('Quiz response not found');
    }

    if (quizResponse.user.id !== userId) {
      throw new Error('Unauthorized access to quiz response');
    }

    // Parse quiz responses into prompt data
    const promptData: MealPlanPromptData =
      this.parseQuizToPromptData(quizResponse);

    // Generate meal plan using LLM
    const mealPlanResponse: MealPlanResponse =
      await this.mealPlanAgent.generateWeeklyMealPlan(promptData);

    // Save recipes and meal plan to database
    const mealPlan = await this.saveMealPlanToDatabase(
      mealPlanResponse,
      userId,
      quizResponseId,
    );

    return mealPlan;
  }

  /**
   * Generate a single recipe suggestion
   */
  async generateSingleRecipe(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    preferences: Partial<MealPlanPromptData>,
    userId: number,
  ): Promise<Recipe> {
    const recipe = await this.mealPlanAgent.generateSingleRecipe(
      mealType,
      preferences,
    );

    // Save to database
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return await this.saveRecipeToDatabase(recipe, user);
  }

  /**
   * Generate grocery list for a meal plan
   */
  async generateGroceryList(mealPlanId: number, userId: number) {
    const mealPlan = await this.mealPlanRepository.findOne({
      where: { id: mealPlanId },
      relations: ['user', 'recipes'],
    });

    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }

    if (mealPlan.user.id !== userId) {
      throw new Error('Unauthorized access to meal plan');
    }

    // Reconstruct weekly meal plan from database
    const weeklyMealPlan = this.reconstructWeeklyMealPlan(mealPlan);

    // Generate grocery list
    return await this.mealPlanAgent.generateGroceryList(weeklyMealPlan);
  }

  /**
   * Helper: Parse quiz response to prompt data
   */
  private parseQuizToPromptData(
    quizResponse: QuizResponse,
  ): MealPlanPromptData {
    // Assuming quiz responses are stored as key-value pairs
    // Adjust based on your actual QuizResponse entity structure
    const responses = quizResponse as any; // Type assertion - adjust to your actual type

    return {
      dietaryPreference: responses.dietary_preference || 'Omnivore',
      allergies: responses.allergies
        ? responses.allergies.split(',').map((a: string) => a.trim())
        : [],
      cookingTime: responses.cooking_time || '30-45 minutes',
      servings: responses.servings || '2',
      skillLevel: responses.skill_level || 'Intermediate',
      cuisines: responses.cuisine
        ? responses.cuisine.split(',').map((c: string) => c.trim())
        : [],
      additionalConstraints: responses.additional_constraints,
    };
  }

  /**
   * Helper: Save meal plan and recipes to database
   */
  private async saveMealPlanToDatabase(
    mealPlanResponse: MealPlanResponse,
    userId: number,
    quizResponseId?: number,
  ): Promise<MealPlan> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create schedule object for the meal plan
    const schedule: Record<
      string,
      { breakfast?: number; lunch?: number; dinner?: number }
    > = {};

    // Save all recipes
    const savedRecipes: Recipe[] = [];
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    for (const day of days) {
      const dayMeals =
        mealPlanResponse.mealPlan.meals[
          day as keyof typeof mealPlanResponse.mealPlan.meals
        ];
      schedule[day] = {};

      // Save breakfast
      const breakfast = await this.saveRecipeToDatabase(
        dayMeals.breakfast,
        user,
      );
      savedRecipes.push(breakfast);
      schedule[day].breakfast = breakfast.id;

      // Save lunch
      const lunch = await this.saveRecipeToDatabase(dayMeals.lunch, user);
      savedRecipes.push(lunch);
      schedule[day].lunch = lunch.id;

      // Save dinner
      const dinner = await this.saveRecipeToDatabase(dayMeals.dinner, user);
      savedRecipes.push(dinner);
      schedule[day].dinner = dinner.id;
    }

    // Create and save meal plan
    const mealPlan = this.mealPlanRepository.create({
      name: mealPlanResponse.mealPlan.name,
      schedule,
      user,
      recipes: savedRecipes,
      isFavorite: false,
    });

    return await this.mealPlanRepository.save(mealPlan);
  }

  /**
   * Helper: Save a single recipe to database
   */
  private async saveRecipeToDatabase(
    recipe: MealRecipe,
    user: User,
  ): Promise<Recipe> {
    const recipeEntity = this.recipeRepository.create({
      name: recipe.name,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients.map((ing) => `${ing.amount} ${ing.item}`),
      instructions: recipe.instructions,
      nutrition: recipe.nutrition,
      tags: recipe.tags || [],
      user,
    });

    return await this.recipeRepository.save(recipeEntity);
  }

  /**
   * Helper: Reconstruct weekly meal plan from database entities
   */
  private reconstructWeeklyMealPlan(mealPlan: MealPlan): any {
    // TODO: Implement based on your schedule structure
    // This would fetch recipes by ID from the schedule and reconstruct the weekly plan
    throw new Error('Not implemented');
  }
}
