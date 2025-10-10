import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Week 1 Plan"

  @Column({ default: false })
  isFavorite: boolean;

  @Column('jsonb') // Stores daily meal assignments, e.g., { "Monday": { "breakfast": recipeId, ... } }
  schedule: Record<string, { breakfast?: number; lunch?: number; dinner?: number }>;

  @ManyToOne(() => User, (user) => user.mealPlans)
  user: User;

  @ManyToMany(() => Recipe)
  @JoinTable()
  recipes: Recipe[];
}