import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  prepTime: number;

  @Column()
  cookTime: number;

  @Column()
  servings: number;

  @Column()
  difficulty: string;

  @Column()
  cuisine: string;

  @Column('simple-array')
  ingredients: string[];

  @Column('simple-array')
  instructions: string[];

  @Column('jsonb')
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };

  @Column('simple-array', { nullable: true })
  tags: string[];

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;
}
