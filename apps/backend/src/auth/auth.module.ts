import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import User entity for UserService
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-jwt-secret', // Use env vars in production
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, UserService],
  exports: [JwtAuthGuard, JwtModule], // Export for use in AppModule/AppController
})
export class AuthModule {}