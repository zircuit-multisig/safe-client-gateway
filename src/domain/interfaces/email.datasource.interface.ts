import { EmailVerificationCode } from '@/domain/email/entities/email-verification-code.entity';

export const IEmailDataSource = Symbol('IEmailDataSource');

export interface IEmailDataSource {
  saveEmail(args: {
    chainId: string;
    safeAddress: string;
    emailAddress: string;
    signer: string;
  }): Promise<EmailVerificationCode>;

  updateVerificationCode(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<EmailVerificationCode>;

  verifyEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
    code: string;
  }): Promise<void>;
}
