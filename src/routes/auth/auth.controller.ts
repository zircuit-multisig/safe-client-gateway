import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { recoverMessageAddress } from 'viem';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/routes/auth/auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post()
  async authenticate(
    @Body() message: Record<string, any>,
  ): Promise<{ access_token: any }> {
    const signature = message['signature'];

    const address = await recoverMessageAddress({
      message: 'hello world',
      signature,
    });

    const payload = { sub: address };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
