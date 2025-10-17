import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QuizResponse } from './quiz-response.entity';
import { MealPlan } from './meal-plan.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => QuizResponse, (quizResponse) => quizResponse.user)
  quizResponses: QuizResponse[];

  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans: MealPlan[];

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}
