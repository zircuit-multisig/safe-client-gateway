import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';

@Controller({
  path: 'chains/:chainId/safes/:safeAddress/emails',
  version: '1',
})
export class EmailsController {
  constructor(
    @Inject(IEmailDataSource) private readonly repository: IEmailDataSource,
  ) {}

  @Post()
  async registerEmail(
    @Param('chainId') chainId: string,
    @Param('safeAddress') safeAddress: string,
    @Body()
    registerEmailDto: {
      emailAddress: string;
      signer: string;
    },
  ) {
    return await this.repository.saveEmail({
      chainId,
      safeAddress,
      emailAddress: registerEmailDto.emailAddress,
      signer: registerEmailDto.signer,
    });
  }

  @Post('verify-resend')
  async resendVerification(
    @Param('chainId') chainId: string,
    @Param('safeAddress') safeAddress: string,
    @Body()
    resendVerificationDto: {
      signer: string;
    },
  ) {
    return await this.repository.updateVerificationCode({
      chainId,
      safeAddress,
      signer: resendVerificationDto.signer,
    });
  }

  @Post('verify')
  async verify(
    @Param('chainId') chainId: string,
    @Param('safeAddress') safeAddress: string,
    @Body()
    resendVerificationDto: {
      signer: string;
      code: string;
    },
  ) {
    return await this.repository.verifyEmail({
      chainId,
      safeAddress,
      signer: resendVerificationDto.signer,
      code: resendVerificationDto.code,
    });
  }
}
