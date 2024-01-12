import { Inject, Injectable } from '@nestjs/common';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';
import { ISubscriptionRepository } from '@/domain/subscriptions/subscription.repository.interface';
import { Subscription } from '@/domain/email/entities/subscription.entity';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  public static CATEGORY_ACCOUNT_RECOVERY = 'account_recovery';

  constructor(
    @Inject(IEmailDataSource)
    private readonly emailDataSource: IEmailDataSource,
  ) {}

  subscribe(args: {
    chainId: string;
    safeAddress: string;
    account: string;
    categoryKey: string;
  }): Promise<Subscription[]> {
    return this.emailDataSource.subscribe(args);
  }

  unsubscribe(args: {
    categoryKey: string;
    token: string;
  }): Promise<Subscription[]> {
    return this.emailDataSource.unsubscribe(args);
  }

  unsubscribeAll(args: { token: string }): Promise<Subscription[]> {
    return this.emailDataSource.unsubscribeAll(args);
  }
}
