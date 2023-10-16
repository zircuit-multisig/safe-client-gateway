import { Module } from '@nestjs/common';
import { EmailRepository } from '@/domain/email/email.repository';

@Module({ providers: [EmailRepository], exports: [EmailRepository] })
export class EmailModule {}
