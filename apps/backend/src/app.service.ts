import { Injectable } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  async create(recipeData: Partial<Recipe>): Promise<Recipe> {
    const recipe = this.recipeRepository.create(recipeData);
    return this.recipeRepository.save(recipe);
  }
}
