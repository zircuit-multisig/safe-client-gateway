import { Inject, Injectable } from '@nestjs/common';
import { IAccountRepository } from '@/domain/account/account.repository.interface';
import { Email } from '@/routes/email/entities/email.entity';
import { EmailPublicState } from '@/routes/email/entities/email-public-state.entity';
import { AccountDoesNotExistError } from '@/domain/account/errors/account-does-not-exist.error';

@Injectable()
export class EmailService {
  constructor(
    @Inject(IAccountRepository) private readonly repository: IAccountRepository,
  ) {}

  async saveEmail(args: {
    chainId: string;
    safeAddress: string;
    emailAddress: string;
    signer: string;
  }): Promise<void> {
    return this.repository.createAccount(args);
  }

  async resendVerification(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<void> {
    return this.repository.resendEmailVerification(args);
  }

  async verifyEmailAddress(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
    code: string;
  }): Promise<void> {
    return this.repository.verifyEmailAddress(args);
  }

  async deleteEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<void> {
    return this.repository.deleteAccount(args);
  }

  async editEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
    emailAddress: string;
  }): Promise<void> {
    return this.repository.editEmail(args);
  }

  async getEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<Email> {
    const account = await this.repository.getAccount(args);
    return new Email(account.emailAddress.value, account.isVerified);
  }

  async getEmailPublicState(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<EmailPublicState> {
    try {
      const account = await this.repository.getAccount(args);
      return new EmailPublicState(account.isVerified);
    } catch (error) {
      if (error instanceof AccountDoesNotExistError) {
        return new EmailPublicState(false);
      }
      throw error;
    }
  }
}
