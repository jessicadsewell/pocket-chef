# AI Agents

This directory contains AI agent implementations for PocketChef.

## Structure

```
agents/
├── meal-plan.agent.ts    # Main meal planning agent with LLM integration
├── index.ts              # Exports all agents
└── README.md             # This file
```

## Agents

### MealPlanAgent

The `MealPlanAgent` handles all LLM interactions for meal planning functionality.

**Key Features:**

- Generate complete weekly meal plans (21 meals)
- Create single recipe suggestions
- Generate recipe variations
- Create consolidated grocery lists

**Supported LLM Providers:**

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)

## Usage

### Basic Setup

```typescript
import { createMealPlanAgent } from './agents';

// Create agent with OpenAI
const agent = createMealPlanAgent('openai', process.env.OPENAI_API_KEY);

// Or with Anthropic
const agent = createMealPlanAgent('anthropic', process.env.ANTHROPIC_API_KEY);
```

### Generate Weekly Meal Plan

```typescript
const mealPlan = await agent.generateWeeklyMealPlan({
  dietaryPreference: 'Vegetarian',
  allergies: ['Nuts', 'Dairy'],
  cookingTime: '30-45 minutes',
  servings: '2',
  skillLevel: 'Intermediate',
  cuisines: ['Italian', 'Mediterranean'],
  additionalConstraints: 'High-protein meals for marathon training',
});
```

### Generate Single Recipe

```typescript
const recipe = await agent.generateSingleRecipe('dinner', {
  dietaryPreference: 'Vegan',
  cookingTime: '30 minutes',
  skillLevel: 'Beginner',
});
```

### Generate Grocery List

```typescript
const groceryList = await agent.generateGroceryList(weeklyMealPlan);
```

## Adding a New LLM Provider

1. Create a new class extending `BaseLLMAgent`:

```typescript
export class CustomLLMAgent extends BaseLLMAgent {
  async complete(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    // Your implementation here
  }
}
```

2. Update the `createMealPlanAgent` factory function:

```typescript
export function createMealPlanAgent(
  provider: 'openai' | 'anthropic' | 'custom',
  apiKey: string,
  model?: string,
): MealPlanAgent {
  // Add your provider case
  case 'custom':
    llmAgent = new CustomLLMAgent(apiKey, model || 'default-model');
    break;
}
```

## Environment Variables

Add these to your `.env` file:

```bash
# LLM Provider (openai, anthropic)
LLM_PROVIDER=openai

# API Key for your chosen provider
LLM_API_KEY=your-api-key-here

# Optional: Specific model to use
LLM_MODEL=gpt-4o
```

## Response Format

All agents return structured JSON data. Example response structure:

```json
{
  "mealPlan": {
    "name": "Healthy Vegetarian Week 1",
    "description": "High-protein vegetarian meals",
    "totalCalories": "2000",
    "meals": {
      "monday": {
        "breakfast": {
          /* MealRecipe */
        },
        "lunch": {
          /* MealRecipe */
        },
        "dinner": {
          /* MealRecipe */
        }
      }
      // ... other days
    }
  }
}
```

## Error Handling

All agent methods include error handling and will throw descriptive errors:

```typescript
try {
  const mealPlan = await agent.generateWeeklyMealPlan(data);
} catch (error) {
  console.error('Failed to generate meal plan:', error.message);
  // Handle error appropriately
}
```

## Testing

```bash
# Run agent tests
npm test agents

# Test with specific provider
LLM_PROVIDER=openai npm test agents
```

## Performance Considerations

- **Token Usage**: Weekly meal plans use ~6000-8000 tokens
- **Response Time**: Typically 10-30 seconds for full week
- **Cost**: ~$0.10-0.50 per meal plan (varies by provider and model)

## Best Practices

1. **Cache Results**: Store generated meal plans in database to avoid regenerating
2. **Rate Limiting**: Implement rate limits for LLM calls
3. **Fallback Logic**: Have backup recipes in case LLM fails
4. **Validation**: Always validate LLM responses match expected schema
5. **Monitoring**: Track LLM usage, costs, and errors

## Troubleshooting

### "LLM_API_KEY is not configured"

Ensure your `.env` file includes the API key for your chosen provider.

### "Failed to generate meal plan"

- Check API key is valid
- Verify you have sufficient API credits
- Check network connectivity
- Review prompt data for invalid values

### JSON Parsing Errors

The LLM occasionally returns invalid JSON. We include retry logic, but you may need to adjust the temperature or add explicit JSON formatting instructions in the prompt.
