import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SupabaseModule],
  providers: [SupabaseAuthGuard, UserService],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}
