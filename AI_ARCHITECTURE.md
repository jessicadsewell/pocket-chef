# AI Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                  │
│  ┌────────────────┐     ┌──────────────┐    ┌───────────────┐ │
│  │   Quiz.tsx     │────▶│ API Client   │───▶│  MealPlans    │ │
│  │                │     │              │    │  Page         │ │
│  │ • Take quiz    │     │ POST /api/   │    │               │ │
│  │ • View history │     │ meal-plans/  │    │ • View plan   │ │
│  │ • Generate     │     │ generate/:id │    │ • Grocery list│ │
│  └────────────────┘     └──────────────┘    └───────────────┘ │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 │ HTTP/JSON
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      BACKEND (NestJS)                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MealPlanController                          │   │
│  │  • POST /generate/:quizResponseId                        │   │
│  │  • POST /recipe                                          │   │
│  │  • GET /:id/grocery-list                                 │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │              MealPlanService                             │   │
│  │  • generateFromQuizResponse()                            │   │
│  │  • generateSingleRecipe()                                │   │
│  │  • generateGroceryList()                                 │   │
│  │  • parseQuizToPromptData()                               │   │
│  │  • saveMealPlanToDatabase()                              │   │
│  └──────────────────┬───────────────────┬───────────────────┘   │
│                     │                   │                        │
│         ┌───────────▼──────┐   ┌────────▼──────────┐           │
│         │  MealPlanAgent   │   │   Database        │           │
│         │                  │   │   (TypeORM)       │           │
│         │  • generate      │   │                   │           │
│         │    WeeklyMealPlan│   │  • MealPlan       │           │
│         │  • generate      │   │  • Recipe         │           │
│         │    SingleRecipe  │   │  • QuizResponse   │           │
│         │  • generate      │   │  • User           │           │
│         │    GroceryList   │   │                   │           │
│         └─────────┬────────┘   └───────────────────┘           │
│                   │                                              │
│         ┌─────────▼────────┐                                    │
│         │   LLM Provider   │                                    │
│         │   (Polymorphic)  │                                    │
│         │                  │                                    │
│         │  ┌──────────────┐│                                    │
│         │  │ OpenAIAgent  ││                                    │
│         │  └──────────────┘│                                    │
│         │         or        │                                    │
│         │  ┌──────────────┐│                                    │
│         │  │AnthropicAgent││                                    │
│         │  └──────────────┘│                                    │
│         └─────────┬────────┘                                    │
└───────────────────┼─────────────────────────────────────────────┘
                    │
                    │ API Call
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│                    EXTERNAL LLM API                              │
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  OpenAI GPT-4    │      OR      │  Anthropic Claude│        │
│  │                  │              │                  │        │
│  │  • gpt-4o        │              │  • claude-3.5    │        │
│  │  • gpt-4-turbo   │              │  • claude-3-opus │        │
│  │  • gpt-3.5-turbo │              │  • claude-3-sonn.│        │
│  └──────────────────┘              └──────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Quiz Submission Flow

```
User fills quiz
    │
    ├─▶ Structured data (dietary preference, allergies, etc.)
    │
    └─▶ Additional constraints (free-form text)
        │
        ▼
Frontend submits quiz
        │
        ▼
Backend saves QuizResponse
        │
        ▼
Returns quiz ID to frontend
```

### 2. Meal Plan Generation Flow

```
User clicks "Generate AI Meal Plan"
        │
        ▼
Frontend calls POST /api/meal-plans/generate/:quizResponseId
        │
        ▼
MealPlanService fetches QuizResponse from DB
        │
        ▼
parseQuizToPromptData() converts to MealPlanPromptData
        │
        ▼
MealPlanAgent constructs prompts using templates
        │
        ├─▶ System Prompt (defines AI role)
        │
        └─▶ User Prompt (includes all quiz data + constraints)
            │
            ▼
        LLM Provider processes request
            │
            ▼
        Returns JSON with 21 meals (7 days × 3 meals)
            │
            ▼
        MealPlanService saves to database
            │
            ├─▶ Creates Recipe entities (21 recipes)
            │
            └─▶ Creates MealPlan entity (with schedule)
                │
                ▼
            Returns MealPlan to frontend
                │
                ▼
            Frontend displays success & updates UI
```

## Directory Structure

```
apps/backend/src/
│
├── agents/                          # 🤖 AI Agent Layer
│   ├── meal-plan.agent.ts          # Main agent with LLM integration
│   │   ├── BaseLLMAgent            # Abstract base class
│   │   ├── OpenAIAgent             # OpenAI implementation
│   │   ├── AnthropicAgent          # Anthropic implementation
│   │   └── MealPlanAgent           # Business logic agent
│   ├── index.ts                    # Exports
│   └── README.md                   # Documentation
│
├── prompts/                         # 📝 Prompt Templates Layer
│   ├── meal-plan.prompts.ts        # All prompt templates
│   │   ├── getMealPlanSystemPrompt()
│   │   ├── getWeeklyMealPlanPrompt()
│   │   ├── getRecipeVariationPrompt()
│   │   ├── getSingleRecipeSuggestionPrompt()
│   │   └── getGroceryListPrompt()
│   ├── index.ts                    # Exports
│   └── README.md                   # Documentation
│
├── services/                        # 💼 Service Layer
│   └── meal-plan.service.ts        # NestJS service
│       ├── generateFromQuizResponse()
│       ├── generateSingleRecipe()
│       ├── generateGroceryList()
│       ├── parseQuizToPromptData()
│       └── saveMealPlanToDatabase()
│
├── controllers/                     # 🎮 Controller Layer
│   └── meal-plan.controller.ts     # REST API endpoints
│
├── entities/                        # 🗄️ Database Layer
│   ├── meal-plan.entity.ts
│   ├── recipe.entity.ts
│   ├── quiz-response.entity.ts
│   └── user.entity.ts
│
└── AI_INTEGRATION_GUIDE.md         # 📚 Setup guide
```

## Component Responsibilities

### 🎨 Frontend (Quiz.tsx)

**Responsibilities:**

- Collect user preferences through quiz
- Display quiz history
- Trigger meal plan generation
- Show loading states
- Display results

**Key State:**

```typescript
- quizAnswers: Record<string, string | string[]>
- pastResponses: QuizResponse[]
- isQuizOpen: boolean
- currentStep: number
```

### 🎮 Controller (MealPlanController)

**Responsibilities:**

- Handle HTTP requests
- Validate request parameters
- Authentication/authorization
- Call service layer
- Return responses

**Endpoints:**

```typescript
POST   /api/meal-plans/generate/:quizResponseId
POST   /api/meal-plans/recipe
GET    /api/meal-plans/:id/grocery-list
```

### 💼 Service (MealPlanService)

**Responsibilities:**

- Business logic orchestration
- Database operations
- Data transformation
- Agent coordination
- Error handling

**Key Methods:**

```typescript
generateFromQuizResponse(quizResponseId, userId);
generateSingleRecipe(mealType, preferences, userId);
generateGroceryList(mealPlanId, userId);
```

### 🤖 Agent (MealPlanAgent)

**Responsibilities:**

- LLM communication
- Prompt construction
- Response parsing
- Retry logic
- Provider abstraction

**Key Methods:**

```typescript
generateWeeklyMealPlan(promptData);
generateSingleRecipe(mealType, preferences);
generateRecipeVariation(recipe, constraints);
generateGroceryList(mealPlan);
```

### 📝 Prompts (meal-plan.prompts.ts)

**Responsibilities:**

- Define system prompts
- Template user prompts
- Structure output format
- Handle optional parameters
- Provide examples

**Key Functions:**

```typescript
getMealPlanSystemPrompt();
getWeeklyMealPlanPrompt(data);
getRecipeVariationPrompt(recipe, constraints);
getSingleRecipeSuggestionPrompt(mealType, preferences);
getGroceryListPrompt(mealPlanJson);
```

## Design Patterns Used

### 1. **Strategy Pattern** (LLM Providers)

```typescript
// Choose provider at runtime
BaseLLMAgent
  ├── OpenAIAgent
  └── AnthropicAgent
```

### 2. **Factory Pattern** (Agent Creation)

```typescript
createMealPlanAgent(provider, apiKey, model);
```

### 3. **Template Method Pattern** (Prompts)

```typescript
// Prompts define structure, data fills in details
getWeeklyMealPlanPrompt(data: MealPlanPromptData)
```

### 4. **Repository Pattern** (Database Access)

```typescript
// TypeORM repositories
@InjectRepository(MealPlan)
private mealPlanRepository: Repository<MealPlan>
```

### 5. **Dependency Injection** (NestJS)

```typescript
// Services injected via constructor
constructor(
  private mealPlanService: MealPlanService,
  private configService: ConfigService,
) {}
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless Design**: All agents are stateless
- **Database Connection Pooling**: Multiple instances can share DB
- **API Rate Limiting**: Per-user limits prevent abuse

### Caching Strategy

```typescript
// Cache meal plans for 7 days
- Key: `meal-plan:${quizResponseId}`
- TTL: 604800 seconds (7 days)
- Invalidate on: User regenerates plan
```

### Async Processing (Future Enhancement)

```
User clicks generate
    │
    ▼
Create job in queue (Bull/Redis)
    │
    ▼
Return job ID immediately
    │
    ▼
Worker processes job asynchronously
    │
    ▼
WebSocket/SSE notifies frontend when complete
```

## Security Layers

```
┌─────────────────────────────────────┐
│  API Key Security                   │
│  • Environment variables only       │
│  • Never in version control         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Authentication                     │
│  • JWT tokens                       │
│  • User ownership validation        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Rate Limiting                      │
│  • Per-user quotas                  │
│  • Per-endpoint limits              │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Input Validation                   │
│  • Quiz data validation             │
│  • Constraint text sanitization     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Error Handling                     │
│  • Don't expose LLM errors          │
│  • Log all failures                 │
└─────────────────────────────────────┘
```

## Monitoring & Observability

### Key Metrics to Track

1. **LLM Usage**

   - API calls per day
   - Token consumption
   - Cost per meal plan
   - Error rates

2. **Performance**

   - Response time (p50, p95, p99)
   - Success/failure ratio
   - Cache hit rate

3. **Business Metrics**
   - Meal plans generated
   - Most popular cuisines
   - Dietary preference distribution
   - User satisfaction (optional feedback)

### Logging Strategy

```typescript
// Structured logging
logger.info("Generating meal plan", {
  userId,
  quizResponseId,
  provider: "openai",
  model: "gpt-4o",
});

logger.error("LLM generation failed", {
  userId,
  error: error.message,
  retryCount: 3,
});
```

## Cost Optimization

### Strategies

1. **Cache aggressively** - Store generated plans
2. **Batch operations** - Generate multiple days at once
3. **Use cheaper models** for simpler tasks (GPT-3.5 for single recipes)
4. **Implement quotas** - Limit generations per user per day
5. **Offer regeneration** by day instead of full week

### Cost Comparison

| Provider  | Model             | Cost/Meal Plan | Speed     |
| --------- | ----------------- | -------------- | --------- |
| OpenAI    | GPT-4o            | $0.30-0.50     | Fast      |
| OpenAI    | GPT-3.5-turbo     | $0.05-0.10     | Very Fast |
| Anthropic | Claude 3.5 Sonnet | $0.40-0.60     | Fast      |
| Anthropic | Claude 3 Haiku    | $0.10-0.15     | Very Fast |

## Future Enhancements

1. **Streaming Responses**: Show recipes as they're generated
2. **Image Generation**: Add AI-generated food images (DALL-E/Midjourney)
3. **Voice Input**: Accept constraints via voice (Whisper API)
4. **Smart Substitutions**: Suggest ingredient swaps based on availability
5. **Nutritionist Mode**: Advanced nutritional analysis and recommendations
6. **Social Features**: Share meal plans, rate recipes
7. **Seasonal Suggestions**: Adjust based on seasonal ingredients
8. **Budget Optimizer**: Generate plans within specific budget constraints
