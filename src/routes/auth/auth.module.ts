import { HttpStatus, Module } from '@nestjs/common';
import { AuthController } from '@/routes/auth/auth.controller';
import { AuthService } from '@/routes/auth/auth.service';
import { AuthDomainModule } from '@/domain/auth/auth.domain.module';
import { getVerifyAuthMessageDtoSchema } from '@/routes/auth/entities/verify-auth-message.dto.entity';
import { IConfigurationService } from '@/config/configuration.service.interface';

function provideAuthSchema(
  configurationService: IConfigurationService,
): unknown {
  const maxValidityPeriodInSeconds = configurationService.getOrThrow<number>(
    'auth.maxValidityPeriodInSeconds',
  );
  return getVerifyAuthMessageDtoSchema(maxValidityPeriodInSeconds);
}

@Module({
  imports: [AuthDomainModule],
  providers: [
    AuthService,
    {
      provide: 'VALIDATION_SCHEMA',
      useFactory: provideAuthSchema,
      inject: [IConfigurationService],
    },
    {
      provide: 'VALIDATION_CODE',
      useValue: HttpStatus.UNPROCESSABLE_ENTITY,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
