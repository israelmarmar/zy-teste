import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [JwtService],
})
export class AuthModule {}
