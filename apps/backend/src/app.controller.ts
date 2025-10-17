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
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { SupabaseService } from './supabase/supabase.service';
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
    private supabaseService: SupabaseService,
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
      // Sign in with Supabase
      const { data, error } = await this.supabaseService.signIn(
        body.email,
        body.password,
      );

      if (error || !data.user || !data.session) {
        return res.inertia.render('Auth/Login', {
          error: 'Invalid credentials',
        });
      }

      // Share user and token with frontend
      res.inertia.share({
        auth: {
          user: {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email,
            email: data.user.email,
          },
          token: data.session.access_token,
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
  @UseGuards(SupabaseAuthGuard)
  async logout(@Res() res: Response) {
    await this.supabaseService.signOut();
    res.inertia.share({ auth: null });
    return res.inertia.redirect('/login');
  }

  @Get('register')
  async registerPage(@Res() res: Response) {
    return res.inertia.render('Auth/Register');
  }

  @Get('auth/callback')
  async authCallback(@Res() res: Response) {
    return res.inertia.render('Auth/Callback');
  }

  @Get('auth/reset-password')
  async resetPasswordPage(@Res() res: Response) {
    return res.inertia.render('Auth/ResetPassword');
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      // Sign up with Supabase
      const { data, error } = await this.supabaseService.signUp(
        body.email,
        body.password,
        { name: body.name },
      );

      if (error) {
        return res.inertia.render('Auth/Register', {
          error: error.message || 'Registration failed',
        });
      }

      // Success! Supabase Auth handles user storage
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
