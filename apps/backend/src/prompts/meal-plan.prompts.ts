/**
 * Prompt templates for meal plan generation using LLM
 */

export interface MealPlanPromptData {
  dietaryPreference: string;
  allergies: string[];
  cookingTime: string;
  servings: string;
  skillLevel: string;
  cuisines: string[];
  additionalConstraints?: string;
}

/**
 * Generates the system prompt for the meal planning agent
 */
export const getMealPlanSystemPrompt = (): string => {
  return `You are an expert nutritionist and chef AI assistant specializing in personalized meal planning. Your role is to:

1. Create balanced, nutritious meal plans that respect dietary restrictions and preferences
2. Suggest recipes appropriate for the user's cooking skill level
3. Ensure variety in ingredients and cooking methods throughout the week
4. Consider preparation time constraints
5. Provide detailed, easy-to-follow recipes with accurate ingredient measurements
6. Include nutritional information when possible
7. Be creative while staying practical and realistic

Always respond in valid JSON format with the structure provided in the user prompt.`;
};

/**
 * Generates the user prompt for weekly meal plan creation
 */
export const getWeeklyMealPlanPrompt = (data: MealPlanPromptData): string => {
  const allergiesText =
    data.allergies.length > 0 && !data.allergies.includes('None')
      ? data.allergies.join(', ')
      : 'No allergies';

  const cuisinesText =
    data.cuisines.length > 0 ? data.cuisines.join(', ') : 'Any cuisine';

  const additionalConstraintsSection = data.additionalConstraints
    ? `

⚠️  IMPORTANT ADDITIONAL CONSTRAINTS:
${data.additionalConstraints}

Please pay special attention to these user-specified requirements and incorporate them throughout the meal plan.`
    : '';

  return `Create a personalized weekly meal plan with the following specifications:

📋 USER PREFERENCES:
• Dietary Preference: ${data.dietaryPreference}
• Food Allergies/Restrictions: ${allergiesText}
• Available Cooking Time: ${data.cookingTime}
• Number of Servings: ${data.servings} people
• Cooking Skill Level: ${data.skillLevel}
• Preferred Cuisines: ${cuisinesText}${additionalConstraintsSection}

📅 REQUIREMENTS:
Generate a 7-day meal plan (Monday through Sunday) with breakfast, lunch, and dinner for each day.

For each meal, provide:
1. Recipe name
2. Preparation time (in minutes)
3. Cooking time (in minutes)
4. List of ingredients with measurements
5. Step-by-step cooking instructions
6. Nutritional information (calories, protein, carbs, fat)
7. Cuisine type
8. Difficulty level

Ensure the meal plan:
- Respects all dietary restrictions and allergies
- Fits within the specified cooking time per meal
- Matches the user's skill level
- Includes variety (don't repeat the same meal twice)
- Uses the preferred cuisines when possible
- Provides balanced nutrition throughout the week

Return the response in the following JSON structure:

{
  "mealPlan": {
    "name": "Descriptive name for this meal plan",
    "description": "Brief overview highlighting key features",
    "totalCalories": "Average daily calories",
    "meals": {
      "monday": {
        "breakfast": { /* meal object */ },
        "lunch": { /* meal object */ },
        "dinner": { /* meal object */ }
      },
      // ... repeat for all 7 days
    }
  }
}

Each meal object should have this structure:
{
  "name": "Recipe name",
  "prepTime": 15,
  "cookTime": 30,
  "totalTime": 45,
  "servings": ${data.servings},
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "Cuisine type",
  "ingredients": [
    { "item": "ingredient name", "amount": "measurement" }
  ],
  "instructions": [
    "Step 1 description",
    "Step 2 description",
    // ...
  ],
  "nutrition": {
    "calories": 450,
    "protein": "25g",
    "carbs": "45g",
    "fat": "15g",
    "fiber": "8g"
  },
  "tags": ["tag1", "tag2"]
}`;
};

/**
 * Generates a prompt for recipe variations based on constraints
 */
export const getRecipeVariationPrompt = (
  originalRecipe: string,
  constraints: string,
): string => {
  return `Given the following recipe:

${originalRecipe}

Create a variation that meets these specific requirements:
${constraints}

Maintain the same meal type (breakfast/lunch/dinner) but adapt the recipe to meet the new constraints while keeping it:
- Equally nutritious
- Similar in preparation complexity
- Within the same cuisine family if possible

Return the new recipe in the same JSON format as the original.`;
};

/**
 * Generates a prompt for a single recipe suggestion
 */
export const getSingleRecipeSuggestionPrompt = (
  mealType: 'breakfast' | 'lunch' | 'dinner',
  preferences: Partial<MealPlanPromptData>,
): string => {
  return `Suggest a single ${mealType} recipe based on these preferences:

${preferences.dietaryPreference ? `• Dietary Preference: ${preferences.dietaryPreference}` : ''}
${preferences.allergies && preferences.allergies.length > 0 ? `• Avoid: ${preferences.allergies.join(', ')}` : ''}
${preferences.cookingTime ? `• Cooking Time: ${preferences.cookingTime}` : ''}
${preferences.skillLevel ? `• Skill Level: ${preferences.skillLevel}` : ''}
${preferences.additionalConstraints ? `• Additional: ${preferences.additionalConstraints}` : ''}

Return a single recipe in JSON format with the structure:
{
  "name": "Recipe name",
  "prepTime": 15,
  "cookTime": 30,
  "totalTime": 45,
  "servings": 2,
  "difficulty": "Easy",
  "cuisine": "Cuisine type",
  "ingredients": [
    { "item": "ingredient", "amount": "measurement" }
  ],
  "instructions": ["step 1", "step 2"],
  "nutrition": {
    "calories": 450,
    "protein": "25g",
    "carbs": "45g",
    "fat": "15g"
  }
}`;
};

/**
 * Generates a prompt for grocery list creation
 */
export const getGroceryListPrompt = (mealPlanJson: string): string => {
  return `Based on this weekly meal plan:

${mealPlanJson}

Create a consolidated grocery shopping list that:
1. Combines all ingredients from the week
2. Aggregates quantities for items used multiple times
3. Organizes items by grocery store section (Produce, Meat, Dairy, Pantry, etc.)
4. Includes approximate total quantities needed

Return in JSON format:
{
  "groceryList": {
    "Produce": [
      { "item": "ingredient", "quantity": "total amount" }
    ],
    "Meat & Seafood": [...],
    "Dairy": [...],
    "Pantry": [...],
    "Frozen": [...],
    "Other": [...]
  },
  "estimatedCost": "Optional price estimate",
  "shoppingTips": ["tip 1", "tip 2"]
}`;
};
