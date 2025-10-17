/**
 * Supabase Auth Guard - Validates Supabase JWT tokens
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify token with Supabase
      const { data, error } = await this.supabaseService.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user to request
      request.user = data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
