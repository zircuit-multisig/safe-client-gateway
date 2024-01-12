import { Module } from '@nestjs/common';
import { EmailDataSourceModule } from '@/datasources/email/email.datasource.module';
import { EmailApiModule } from '@/datasources/email-api/email-api.module';
import { ISubscriptionRepository } from '@/domain/subscriptions/subscription.repository.interface';
import { SubscriptionRepository } from '@/domain/subscriptions/subscription.repository';

@Module({
  imports: [EmailDataSourceModule, EmailApiModule],
  providers: [
    { provide: ISubscriptionRepository, useClass: SubscriptionRepository },
  ],
  exports: [ISubscriptionRepository],
})
export class SubscriptionDomainModule {}
