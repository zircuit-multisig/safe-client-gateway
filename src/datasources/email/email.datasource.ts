import { Inject, Injectable } from '@nestjs/common';
import * as postgres from 'postgres';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';
import { EmailVerificationCode } from '@/domain/email/entities/email-verification-code.entity';

interface Email {
  id: number;
  chain_id: number;
  email_address: string;
  safe_address: string;
  signer: string;
  verified: boolean;
}

interface VerificationStatus {
  id: number;
  verification_code: string;
  sent_on: Date;
}

@Injectable()
export class EmailDatasource implements IEmailDataSource {
  constructor(@Inject('DB_INSTANCE') private readonly sql: postgres.Sql) {}

  private resetVerificationCode(
    emailId: number,
  ): postgres.PendingQuery<VerificationStatus[]> {
    // TODO proper code generation
    const code = Math.floor(Math.random() * 100_000);
    return this.sql<VerificationStatus[]>`
        INSERT INTO emails.verification (id, verification_code)
        VALUES (${emailId}, ${code})
        ON CONFLICT (id) DO UPDATE SET verification_code = ${code},
                                       sent_on           = now()
        RETURNING *
    `;
  }

  private getEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): postgres.PendingQuery<Email[]> {
    return this.sql<Email[]>`SELECT *
                             FROM emails.signer_emails
                             WHERE chain_id = ${args.chainId}
                               and safe_address = ${args.safeAddress}
                               and signer = ${args.signer}`;
  }

  async saveEmail(args: {
    chainId: string;
    safeAddress: string;
    emailAddress: string;
    signer: string;
  }): Promise<EmailVerificationCode> {
    return await this.sql.begin(async (sql) => {
      const [email] = await sql<Email[]>`
          INSERT INTO emails.signer_emails (chain_id, email_address, safe_address, signer)
          VALUES (${args.chainId}, ${args.emailAddress}, ${args.safeAddress}, ${args.signer})
          RETURNING *
      `;

      const [verificationStatus] = await this.resetVerificationCode(email.id);

      return <EmailVerificationCode>{
        emailAddress: email.email_address,
        verificationCode: verificationStatus.verification_code,
      };
    });
  }

  // TODO this call should be throttled
  async updateVerificationCode(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
  }): Promise<{ emailAddress: string; verificationCode: string }> {
    const [email] = await this.getEmail(args);

    if (!email) {
      // TODO different error since this exposes the non-existence of an email address
      throw new Error('Email address does not exist');
    }

    if (email.verified) {
      throw new Error('Email is already verified');
    }

    const [verificationStatus] = await this.resetVerificationCode(email.id);

    return <EmailVerificationCode>{
      emailAddress: email.email_address,
      verificationCode: verificationStatus.verification_code,
    };
  }

  async verifyEmail(args: {
    chainId: string;
    safeAddress: string;
    signer: string;
    code: string;
  }): Promise<void> {
    return await this.sql.begin(async (sql) => {
      const [email] = await this.getEmail(args);

      // Get verification status for that email. Provided code needs to match
      const [verificationStatus] = await this.sql<VerificationStatus[]>`SELECT *
                                                                        from emails.verification
                                                                        WHERE id = ${email.id}
                                                                          and verification_code = ${args.code}`;

      if (!verificationStatus) {
        throw Error('Invalid verification code');
      }

      // TODO date comparison
      const date = new Date();
      const dateUtc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      );
      const timeDiffSeconds =
        (dateUtc - verificationStatus.sent_on.getTime()) / 1_000;

      if (timeDiffSeconds > 20) {
        throw Error('Code is no longer invalid. Please request new one');
      }

      // Deletes email verification entry
      await this.sql`DELETE
                     FROM emails.verification
                     WHERE id = ${email.id}
      `;

      // Sets email as verified
      await sql`
          UPDATE emails.signer_emails
          SET verified = true
          WHERE id = ${email.id}
      `;
    });
  }
}
