import { Module } from '@nestjs/common';
import { AuthController } from '@/routes/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/routes/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'jwt-secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
