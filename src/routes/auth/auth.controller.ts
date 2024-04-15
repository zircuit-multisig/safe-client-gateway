import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ValidationPipe } from '@/validation/pipes/validation.pipe';
import { AuthService } from '@/routes/auth/auth.service';
import { VerifyAuthMessageDto } from '@/routes/auth/entities/verify-auth-message.dto.entity';
import { IConfigurationService } from '@/config/configuration.service.interface';

/**
 * The AuthController is responsible for handling authentication:
 *
 * 1. Calling `/v1/auth/nonce` returns a unique nonce to be signed.
 * 2. The client signs this nonce in a SIWE message, sending it and
 *    the signature to `/v1/auth/verify` for verification.
 * 3. If verification succeeds, a JWT access token is returned.
 * 4. The access token should be used in the `Authorization` header for
 *    all routes protected by the AuthGuard.
 */
@Controller({ path: 'auth', version: '1' })
@ApiExcludeController()
export class AuthController {
  private readonly maxValidityPeriodInSeconds: number;

  constructor(
    private readonly authService: AuthService,
    @Inject(IConfigurationService)
    private readonly configurationService: IConfigurationService,
  ) {
    this.maxValidityPeriodInSeconds =
      this.configurationService.getOrThrow<number>(
        'auth.maxValidityPeriodInSeconds',
      );
  }

  @Get('nonce')
  async getNonce(): Promise<{
    nonce: string;
  }> {
    return this.authService.getNonce();
  }

  @HttpCode(200)
  @Post('verify')
  async verify(
    @Body(ValidationPipe)
    verifyAuthMessageDto: VerifyAuthMessageDto,
  ): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number | null;
  }> {
    return await this.authService.verify(verifyAuthMessageDto);
  }
}
