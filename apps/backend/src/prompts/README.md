# Prompts

This directory contains prompt templates for LLM interactions.

## Structure

```
prompts/
├── meal-plan.prompts.ts  # Meal planning prompt templates
├── index.ts              # Exports all prompts
└── README.md             # This file
```

## Available Prompts

### Meal Plan Prompts

Located in `meal-plan.prompts.ts`:

#### 1. `getMealPlanSystemPrompt()`

System-level instructions for the LLM defining its role as a nutritionist and chef.

**Usage:**

```typescript
const systemPrompt = getMealPlanSystemPrompt();
```

#### 2. `getWeeklyMealPlanPrompt(data: MealPlanPromptData)`

Generates a detailed prompt for creating a complete weekly meal plan.

**Parameters:**

```typescript
interface MealPlanPromptData {
  dietaryPreference: string;
  allergies: string[];
  cookingTime: string;
  servings: string;
  skillLevel: string;
  cuisines: string[];
  additionalConstraints?: string;
}
```

**Usage:**

```typescript
const prompt = getWeeklyMealPlanPrompt({
  dietaryPreference: 'Vegetarian',
  allergies: ['Nuts'],
  cookingTime: '30-45 minutes',
  servings: '2',
  skillLevel: 'Intermediate',
  cuisines: ['Italian', 'Asian'],
  additionalConstraints: 'High protein, low carb',
});
```

#### 3. `getRecipeVariationPrompt(originalRecipe, constraints)`

Creates variations of existing recipes with new constraints.

**Usage:**

```typescript
const prompt = getRecipeVariationPrompt(
  JSON.stringify(originalRecipe),
  'Make it vegan and gluten-free',
);
```

#### 4. `getSingleRecipeSuggestionPrompt(mealType, preferences)`

Requests a single recipe for a specific meal type.

**Usage:**

```typescript
const prompt = getSingleRecipeSuggestionPrompt('dinner', {
  dietaryPreference: 'Vegan',
  cookingTime: '30 minutes',
});
```

#### 5. `getGroceryListPrompt(mealPlanJson)`

Generates a consolidated grocery list from a meal plan.

**Usage:**

```typescript
const prompt = getGroceryListPrompt(JSON.stringify(weeklyMealPlan));
```

## Prompt Design Principles

### 1. Clarity and Specificity

Each prompt clearly states:

- What output format is expected (JSON schema)
- What constraints must be followed
- What user preferences to respect

### 2. Structured Output

All prompts request JSON responses with defined schemas to ensure:

- Consistent parsing
- Type safety
- Easy validation

### 3. Context and Examples

Prompts include:

- User preference context
- Example formats
- Clear section headers (📋, 📅, ⚠️)

### 4. Flexibility

Prompts handle optional parameters gracefully:

- Additional constraints are optional but highlighted
- Allergies can be "None"
- Preferences have sensible defaults

## Customizing Prompts

### Adding New Prompt Templates

1. Create your prompt function:

```typescript
export const getMyCustomPrompt = (data: MyData): string => {
  return `Your custom prompt here using ${data.field}`;
};
```

2. Export from `index.ts`:

```typescript
export * from './my-custom.prompts';
```

### Modifying Existing Prompts

When modifying prompts:

1. Test changes with multiple scenarios
2. Ensure JSON schema remains consistent
3. Update documentation
4. Version control your changes

### Prompt Variables

Common variables used across prompts:

| Variable                | Description                | Example              |
| ----------------------- | -------------------------- | -------------------- |
| `dietaryPreference`     | User's diet type           | "Vegetarian"         |
| `allergies`             | List of allergens to avoid | ["Nuts", "Dairy"]    |
| `cookingTime`           | Time available for cooking | "30-45 minutes"      |
| `servings`              | Number of people           | "2"                  |
| `skillLevel`            | Cooking expertise          | "Intermediate"       |
| `cuisines`              | Preferred cuisine types    | ["Italian", "Asian"] |
| `additionalConstraints` | Free-form requirements     | "High protein meals" |

## Response Formats

### Weekly Meal Plan Response

```json
{
  "mealPlan": {
    "name": "Plan name",
    "description": "Brief description",
    "totalCalories": "Daily average",
    "meals": {
      "monday": { "breakfast": {}, "lunch": {}, "dinner": {} },
      "tuesday": { ... },
      // ... other days
    }
  }
}
```

### Single Recipe Response

```json
{
  "name": "Recipe name",
  "prepTime": 15,
  "cookTime": 30,
  "totalTime": 45,
  "servings": 2,
  "difficulty": "Easy",
  "cuisine": "Italian",
  "ingredients": [{ "item": "ingredient", "amount": "measurement" }],
  "instructions": ["step 1", "step 2"],
  "nutrition": {
    "calories": 450,
    "protein": "25g",
    "carbs": "45g",
    "fat": "15g"
  }
}
```

### Grocery List Response

```json
{
  "groceryList": {
    "Produce": [
      { "item": "Tomatoes", "quantity": "6 large" }
    ],
    "Meat & Seafood": [...],
    "Dairy": [...],
    "Pantry": [...]
  },
  "estimatedCost": "$75-100",
  "shoppingTips": ["Buy produce at local market", "..."]
}
```

## Best Practices

### 1. Token Efficiency

- Be concise but clear
- Use structured formatting (bullets, sections)
- Avoid redundant instructions

### 2. Error Handling

- Request specific JSON schemas
- Include format examples
- Add validation instructions

### 3. User Experience

- Respect all user constraints
- Provide variety in suggestions
- Balance creativity with practicality

### 4. Maintenance

- Keep prompts DRY (Don't Repeat Yourself)
- Document all changes
- Test with edge cases

## Testing Prompts

Test your prompts with various inputs:

```typescript
// Test with minimal data
const minimalData: MealPlanPromptData = {
  dietaryPreference: 'Omnivore',
  allergies: [],
  cookingTime: '30 minutes',
  servings: '2',
  skillLevel: 'Beginner',
  cuisines: [],
};

// Test with complex data
const complexData: MealPlanPromptData = {
  dietaryPreference: 'Vegan',
  allergies: ['Nuts', 'Soy', 'Gluten'],
  cookingTime: '45-60 minutes',
  servings: '4',
  skillLevel: 'Advanced',
  cuisines: ['Italian', 'Thai', 'Mexican'],
  additionalConstraints: 'High protein, low carb, training for marathon',
};
```

## Versioning

Track prompt versions when making significant changes:

```typescript
/**
 * Weekly Meal Plan Prompt v2.0
 * Changes: Added additional constraints section, improved JSON schema
 */
export const getWeeklyMealPlanPrompt = (data: MealPlanPromptData): string => {
  // ...
};
```

## Contributing

When adding new prompts:

1. Follow the existing naming convention
2. Include TypeScript types for parameters
3. Document with JSDoc comments
4. Add usage examples
5. Update this README
