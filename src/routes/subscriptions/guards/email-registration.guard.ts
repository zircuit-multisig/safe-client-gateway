import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ILoggingService, LoggingService } from '@/logging/logging.interface';
import { verifyMessage } from 'viem';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @Inject(LoggingService) private readonly loggingService: ILoggingService,
  ) {}

  private static readonly ACTION_PREFIX = 'subscription';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const chainId = request.body['chainId'];
    const safe = request.body['safeAddress'];
    const account = request.body['account'];
    const categoryKey = request.body['categoryKey'];
    const signature = request.body['signature'];
    const timestamp = request.body['timestamp'];

    // Required fields
    if (
      !chainId ||
      !safe ||
      !signature ||
      !account ||
      !categoryKey ||
      !timestamp
    )
      return false;

    const message = `${SubscriptionGuard.ACTION_PREFIX}-${chainId}-${safe}-${account}-${categoryKey}-${timestamp}`;

    try {
      return await verifyMessage({
        address: account,
        message,
        signature,
      });
    } catch (e) {
      this.loggingService.debug(e);
      return false;
    }
  }
}
