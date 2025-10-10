/**
 * Meal Plan Agent - Handles LLM interactions for meal planning
 */

import {
  getMealPlanSystemPrompt,
  getWeeklyMealPlanPrompt,
  getRecipeVariationPrompt,
  getSingleRecipeSuggestionPrompt,
  getGroceryListPrompt,
  type MealPlanPromptData,
} from '../prompts/meal-plan.prompts';

export interface MealRecipe {
  name: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  ingredients: Array<{
    item: string;
    amount: string;
  }>;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };
  tags?: string[];
}

export interface DailyMeals {
  breakfast: MealRecipe;
  lunch: MealRecipe;
  dinner: MealRecipe;
}

export interface WeeklyMealPlan {
  name: string;
  description: string;
  totalCalories: string;
  meals: {
    monday: DailyMeals;
    tuesday: DailyMeals;
    wednesday: DailyMeals;
    thursday: DailyMeals;
    friday: DailyMeals;
    saturday: DailyMeals;
    sunday: DailyMeals;
  };
}

export interface MealPlanResponse {
  mealPlan: WeeklyMealPlan;
}

export interface GroceryList {
  groceryList: {
    [category: string]: Array<{
      item: string;
      quantity: string;
    }>;
  };
  estimatedCost?: string;
  shoppingTips?: string[];
}

/**
 * Base LLM Agent class - Replace with your preferred LLM provider
 * (OpenAI, Anthropic, Azure OpenAI, etc.)
 */
export abstract class BaseLLMAgent {
  protected apiKey: string;
  protected model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Send a completion request to the LLM
   */
  abstract complete(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    },
  ): Promise<string>;
}

/**
 * OpenAI implementation example
 * Install: npm install openai
 */
export class OpenAIAgent extends BaseLLMAgent {
  async complete(
    systemPrompt: string,
    userPrompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    } = {},
  ): Promise<string> {
    // TODO: Replace with actual OpenAI SDK implementation
    // Example:
    // const openai = new OpenAI({ apiKey: this.apiKey });
    // const completion = await openai.chat.completions.create({
    //   model: this.model,
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: userPrompt }
    //   ],
    //   temperature: options.temperature ?? 0.7,
    //   max_tokens: options.maxTokens ?? 4000,
    //   response_format: options.responseFormat === 'json'
    //     ? { type: 'json_object' }
    //     : undefined
    // });
    // return completion.choices[0].message.content;

    throw new Error(
      'OpenAI agent not implemented. Add your API key and implementation.',
    );
  }
}

/**
 * Anthropic Claude implementation example
 * Install: npm install @anthropic-ai/sdk
 */
export class AnthropicAgent extends BaseLLMAgent {
  async complete(
    systemPrompt: string,
    userPrompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    } = {},
  ): Promise<string> {
    // TODO: Replace with actual Anthropic SDK implementation
    // Example:
    // const anthropic = new Anthropic({ apiKey: this.apiKey });
    // const message = await anthropic.messages.create({
    //   model: this.model,
    //   max_tokens: options.maxTokens ?? 4000,
    //   temperature: options.temperature ?? 0.7,
    //   system: systemPrompt,
    //   messages: [
    //     { role: 'user', content: userPrompt }
    //   ]
    // });
    // return message.content[0].text;

    throw new Error(
      'Anthropic agent not implemented. Add your API key and implementation.',
    );
  }
}

/**
 * Main Meal Plan Agent Service
 */
export class MealPlanAgent {
  private llmAgent: BaseLLMAgent;

  constructor(llmAgent: BaseLLMAgent) {
    this.llmAgent = llmAgent;
  }

  /**
   * Generate a complete weekly meal plan
   */
  async generateWeeklyMealPlan(
    promptData: MealPlanPromptData,
  ): Promise<MealPlanResponse> {
    const systemPrompt = getMealPlanSystemPrompt();
    const userPrompt = getWeeklyMealPlanPrompt(promptData);

    try {
      const response = await this.llmAgent.complete(systemPrompt, userPrompt, {
        temperature: 0.8, // More creative for recipe generation
        maxTokens: 8000, // Need more tokens for full week plan
        responseFormat: 'json',
      });

      return JSON.parse(response) as MealPlanResponse;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan. Please try again.');
    }
  }

  /**
   * Generate a variation of an existing recipe
   */
  async generateRecipeVariation(
    originalRecipe: MealRecipe,
    constraints: string,
  ): Promise<MealRecipe> {
    const systemPrompt = getMealPlanSystemPrompt();
    const userPrompt = getRecipeVariationPrompt(
      JSON.stringify(originalRecipe),
      constraints,
    );

    try {
      const response = await this.llmAgent.complete(systemPrompt, userPrompt, {
        temperature: 0.7,
        maxTokens: 2000,
        responseFormat: 'json',
      });

      return JSON.parse(response) as MealRecipe;
    } catch (error) {
      console.error('Error generating recipe variation:', error);
      throw new Error('Failed to generate recipe variation. Please try again.');
    }
  }

  /**
   * Generate a single recipe suggestion
   */
  async generateSingleRecipe(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    preferences: Partial<MealPlanPromptData>,
  ): Promise<MealRecipe> {
    const systemPrompt = getMealPlanSystemPrompt();
    const userPrompt = getSingleRecipeSuggestionPrompt(mealType, preferences);

    try {
      const response = await this.llmAgent.complete(systemPrompt, userPrompt, {
        temperature: 0.8,
        maxTokens: 2000,
        responseFormat: 'json',
      });

      return JSON.parse(response) as MealRecipe;
    } catch (error) {
      console.error('Error generating single recipe:', error);
      throw new Error('Failed to generate recipe. Please try again.');
    }
  }

  /**
   * Generate a grocery list from a meal plan
   */
  async generateGroceryList(mealPlan: WeeklyMealPlan): Promise<GroceryList> {
    const systemPrompt = getMealPlanSystemPrompt();
    const userPrompt = getGroceryListPrompt(JSON.stringify(mealPlan));

    try {
      const response = await this.llmAgent.complete(systemPrompt, userPrompt, {
        temperature: 0.3, // Lower temperature for factual aggregation
        maxTokens: 3000,
        responseFormat: 'json',
      });

      return JSON.parse(response) as GroceryList;
    } catch (error) {
      console.error('Error generating grocery list:', error);
      throw new Error('Failed to generate grocery list. Please try again.');
    }
  }
}

/**
 * Factory function to create a meal plan agent with your preferred LLM
 */
export function createMealPlanAgent(
  provider: 'openai' | 'anthropic',
  apiKey: string,
  model?: string,
): MealPlanAgent {
  let llmAgent: BaseLLMAgent;

  switch (provider) {
    case 'openai':
      llmAgent = new OpenAIAgent(
        apiKey,
        model || 'gpt-4o', // or 'gpt-4-turbo', 'gpt-3.5-turbo'
      );
      break;
    case 'anthropic':
      llmAgent = new AnthropicAgent(
        apiKey,
        model || 'claude-3-5-sonnet-20241022', // or 'claude-3-opus-20240229'
      );
      break;
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  return new MealPlanAgent(llmAgent);
}
