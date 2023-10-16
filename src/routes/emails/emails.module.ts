import { Module } from '@nestjs/common';
import { EmailsController } from '@/routes/emails/emails.controller';

@Module({ controllers: [EmailsController] })
export class EmailsModule {}
