import { Subscription } from '@/domain/email/entities/subscription.entity';

export const ISubscriptionRepository = Symbol('ISubscriptionRepository');

export interface ISubscriptionRepository {
  subscribe(args: {
    chainId: string;
    safeAddress: string;
    account: string;
    categoryKey: string;
  }): Promise<Subscription[]>;

  unsubscribe(args: {
    categoryKey: string;
    token: string;
  }): Promise<Subscription[]>;

  unsubscribeAll(args: { token: string }): Promise<Subscription[]>;
}
