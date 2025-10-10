# AI Integration Guide for PocketChef

This guide explains how to integrate the AI meal planning functionality into your PocketChef application.

## 📁 File Structure

```
apps/backend/src/
├── agents/                      # AI agent implementations
│   ├── meal-plan.agent.ts       # Main LLM agent
│   ├── index.ts                 # Exports
│   └── README.md                # Agent documentation
├── prompts/                     # LLM prompt templates
│   ├── meal-plan.prompts.ts     # Meal planning prompts
│   ├── index.ts                 # Exports
│   └── README.md                # Prompt documentation
├── services/                    # Business logic services
│   └── meal-plan.service.ts     # Meal plan service (uses agents)
└── entities/                    # Database entities
    ├── meal-plan.entity.ts
    ├── quiz-response.entity.ts
    ├── recipe.entity.ts
    └── user.entity.ts
```

## 🚀 Quick Start

### 1. Install Dependencies

Choose your LLM provider and install the SDK:

**For OpenAI:**

```bash
cd apps/backend
npm install openai
```

**For Anthropic (Claude):**

```bash
cd apps/backend
npm install @anthropic-ai/sdk
```

**For NestJS Config:**

```bash
npm install @nestjs/config
```

### 2. Configure Environment Variables

Create a `.env` file in `apps/backend/`:

```bash
# LLM Configuration
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key-here
LLM_MODEL=gpt-4o

# Database and other configs...
```

### 3. Implement the LLM Agent

Update the placeholder in `agents/meal-plan.agent.ts`:

**For OpenAI:**

```typescript
import OpenAI from 'openai';

export class OpenAIAgent extends BaseLLMAgent {
  private client: OpenAI;

  constructor(apiKey: string, model: string) {
    super(apiKey, model);
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    } = {},
  ): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000,
      response_format:
        options.responseFormat === 'json' ? { type: 'json_object' } : undefined,
    });

    return completion.choices[0].message.content || '';
  }
}
```

**For Anthropic:**

```typescript
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicAgent extends BaseLLMAgent {
  private client: Anthropic;

  constructor(apiKey: string, model: string) {
    super(apiKey, model);
    this.client = new Anthropic({ apiKey: this.apiKey });
  }

  async complete(
    systemPrompt: string,
    userPrompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    } = {},
  ): Promise<string> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens ?? 4000,
      temperature: options.temperature ?? 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }
}
```

### 4. Create the Controller

Create `apps/backend/src/controllers/meal-plan.controller.ts`:

```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MealPlanService } from '../services/meal-plan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  @Post('generate/:quizResponseId')
  async generateFromQuiz(
    @Param('quizResponseId') quizResponseId: number,
    @Request() req,
  ) {
    return await this.mealPlanService.generateFromQuizResponse(
      quizResponseId,
      req.user.id,
    );
  }

  @Post('recipe')
  async generateSingleRecipe(
    @Body()
    body: { mealType: 'breakfast' | 'lunch' | 'dinner'; preferences: any },
    @Request() req,
  ) {
    return await this.mealPlanService.generateSingleRecipe(
      body.mealType,
      body.preferences,
      req.user.id,
    );
  }

  @Get(':id/grocery-list')
  async getGroceryList(@Param('id') id: number, @Request() req) {
    return await this.mealPlanService.generateGroceryList(id, req.user.id);
  }
}
```

### 5. Update App Module

Update `apps/backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlanController } from './controllers/meal-plan.controller';
import { MealPlanService } from './services/meal-plan.service';
import { MealPlan } from './entities/meal-plan.entity';
import { QuizResponse } from './entities/quiz-response.entity';
import { Recipe } from './entities/recipe.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([MealPlan, QuizResponse, Recipe, User]),
    // ... other imports
  ],
  controllers: [MealPlanController],
  providers: [MealPlanService],
})
export class AppModule {}
```

## 🎯 Usage Examples

### From Frontend (Quiz.tsx)

Update the `handleGenerateMealPlan` function in `Quiz.tsx`:

```typescript
const handleGenerateMealPlan = async (responseId: number) => {
  try {
    setGenerating(true);

    const response = await fetch(
      `http://localhost:3000/api/meal-plans/generate/${responseId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to generate meal plan');
    }

    const mealPlan = await response.json();

    // Update state to show the meal plan was created
    setPastResponses((prev) =>
      prev.map((r) =>
        r.id === responseId
          ? { ...r, mealPlanId: mealPlan.id, mealPlanName: mealPlan.name }
          : r,
      ),
    );

    // Show success message
    alert('Meal plan generated successfully!');
  } catch (error) {
    console.error('Error generating meal plan:', error);
    alert('Failed to generate meal plan. Please try again.');
  } finally {
    setGenerating(false);
  }
};
```

### API Endpoints

Once integrated, you'll have these endpoints:

| Endpoint                                   | Method | Description                    |
| ------------------------------------------ | ------ | ------------------------------ |
| `/api/meal-plans/generate/:quizResponseId` | POST   | Generate meal plan from quiz   |
| `/api/meal-plans/recipe`                   | POST   | Generate single recipe         |
| `/api/meal-plans/:id/grocery-list`         | GET    | Get grocery list for meal plan |

## 🧪 Testing

### Test the Agent Directly

Create a test file `apps/backend/src/agents/__tests__/meal-plan.agent.test.ts`:

```typescript
import { createMealPlanAgent } from '../meal-plan.agent';

describe('MealPlanAgent', () => {
  const agent = createMealPlanAgent(
    'openai',
    process.env.LLM_API_KEY!,
    'gpt-4o',
  );

  it('should generate a weekly meal plan', async () => {
    const result = await agent.generateWeeklyMealPlan({
      dietaryPreference: 'Vegetarian',
      allergies: [],
      cookingTime: '30-45 minutes',
      servings: '2',
      skillLevel: 'Intermediate',
      cuisines: ['Italian'],
    });

    expect(result.mealPlan).toBeDefined();
    expect(result.mealPlan.meals.monday).toBeDefined();
  }, 60000); // 60 second timeout
});
```

### Test via cURL

```bash
# Generate meal plan from quiz response
curl -X POST http://localhost:3000/api/meal-plans/generate/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Get grocery list
curl http://localhost:3000/api/meal-plans/1/grocery-list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 💰 Cost Estimation

### OpenAI (GPT-4)

- Weekly meal plan: ~$0.30-0.50 per generation
- Single recipe: ~$0.05-0.10
- Grocery list: ~$0.10-0.15

### Anthropic (Claude 3.5 Sonnet)

- Weekly meal plan: ~$0.40-0.60 per generation
- Single recipe: ~$0.06-0.12
- Grocery list: ~$0.12-0.18

**Cost Optimization Tips:**

1. Cache generated meal plans in database
2. Allow users to regenerate only specific days
3. Use GPT-3.5-turbo for simpler requests
4. Implement rate limiting (e.g., 5 generations per user per day)

## 🔒 Security Best Practices

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys periodically

2. **Rate Limiting**

   ```typescript
   // Add to controller
   @UseGuards(ThrottlerGuard)
   @Throttle(5, 3600) // 5 requests per hour
   ```

3. **Input Validation**
   - Validate quiz responses before sending to LLM
   - Sanitize user input in additional constraints
   - Set maximum length for free-form text

4. **Error Handling**
   - Don't expose LLM errors to users
   - Log errors for debugging
   - Provide user-friendly error messages

## 📊 Monitoring

Track these metrics:

1. **LLM Usage**
   - Total API calls per day/month
   - Token usage
   - Cost tracking

2. **Performance**
   - Response times
   - Success/failure rates
   - Timeout occurrences

3. **User Behavior**
   - How many users generate meal plans
   - Most common dietary preferences
   - Most requested cuisines

## 🐛 Troubleshooting

### Common Issues

**Issue: "Failed to generate meal plan"**

- Check API key is valid
- Verify you have credits/quota
- Check network connectivity
- Review prompt data for invalid values

**Issue: JSON parsing errors**

- Lower the temperature (makes output more deterministic)
- Add retry logic with exponential backoff
- Validate LLM response before parsing

**Issue: Slow generation times**

- Use streaming responses
- Generate partial results (e.g., 3 days at a time)
- Consider using GPT-3.5-turbo for faster responses

## 🚀 Going to Production

### Pre-launch Checklist

- [ ] Set up API key rotation
- [ ] Implement caching strategy
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and alerts
- [ ] Implement rate limiting
- [ ] Test with various edge cases
- [ ] Set usage budgets/limits
- [ ] Document API for frontend team
- [ ] Create backup/fallback recipes
- [ ] Load test the endpoint

### Production Environment Variables

```bash
LLM_PROVIDER=openai
LLM_API_KEY=your-production-api-key
LLM_MODEL=gpt-4o
LLM_MAX_RETRIES=3
LLM_TIMEOUT=30000
MEAL_PLAN_CACHE_TTL=604800  # 7 days in seconds
```

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [NestJS Documentation](https://docs.nestjs.com)

## 🤝 Support

If you encounter issues:

1. Check the logs in `apps/backend/logs/`
2. Review the agent and prompt README files
3. Test prompts in the LLM playground first
4. Create an issue with reproduction steps
