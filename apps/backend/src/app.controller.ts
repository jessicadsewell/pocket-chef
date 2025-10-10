import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@Controller()
@UsePipes(new ValidationPipe())
export class AppController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async home(@Res() res: Response) {
    return res.inertia.render('Home');
  }

  @Get('login')
  async loginPage(@Res() res: Response) {
    return res.inertia.render('Auth/Login');
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const user = await this.userService.findByEmail(body.email);
      if (!user || !(await bcrypt.compare(body.password, user.password))) {
        return res.inertia.render('Auth/Login', {
          error: 'Invalid credentials',
        });
      }
      const token = this.jwtService.sign({
        email: user.email,
        id: user.id,
        name: user.name,
      });
      // Set token in response and redirect
      res.inertia.share({
        auth: {
          user: { id: user.id, name: user.name, email: user.email },
          token,
        },
      });
      return res.inertia.redirect('/');
    } catch (error) {
      return res.inertia.render('Auth/Login', {
        error: 'An error occurred during login',
      });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.inertia.share({ auth: null });
    return res.inertia.redirect('/login');
  }

  @Get('register')
  async registerPage(@Res() res: Response) {
    return res.inertia.render('Auth/Register');
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      await this.userService.create(body);
      return res.inertia.redirect('/login');
    } catch (error) {
      return res.inertia.render('Auth/Register', {
        error: 'An error occurred during registration',
      });
    }
  }

  @Get('recipes')
  async recipes(@Res() res: Response) {
    // TODO: Fetch recipes from database
    const recipes = [
      {
        id: 1,
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta dish',
      },
      {
        id: 2,
        name: 'Chicken Stir Fry',
        description: 'Quick and healthy Asian-inspired meal',
      },
    ];
    return res.inertia.render('Recipes', { recipes });
  }

  @Get('meal-plans')
  @UseGuards(JwtAuthGuard)
  async mealPlans(@Res() res: Response) {
    // TODO: Fetch meal plans from database
    const meals = [
      {
        name: 'Monday Dinner',
        ingredients: ['Chicken breast', 'Rice', 'Vegetables'],
        instructions: 'Cook chicken, steam rice, sauté vegetables',
      },
      {
        name: 'Tuesday Lunch',
        ingredients: ['Pasta', 'Tomato sauce', 'Cheese'],
        instructions: 'Boil pasta, heat sauce, mix and top with cheese',
      },
    ];
    return res.inertia.render('MealPlans', { meals });
  }

  @Get('quiz')
  async quiz(@Res() res: Response) {
    return res.inertia.render('Quiz');
  }
}
