import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SubscriptionService } from '@/routes/subscriptions/subscription.service';
import { SubscriptionDto } from '@/routes/subscriptions/entities/subscription-dto.entity';
import { TimestampGuard } from '@/routes/email/guards/timestamp.guard';
import { SubscriptionGuard } from '@/routes/subscriptions/guards/email-registration.guard';

@Controller({
  path: 'subscriptions',
  version: '1',
})
@ApiExcludeController()
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Put()
  @UseGuards(
    SubscriptionGuard,
    TimestampGuard(5 * 60 * 1000), // 5 minutes
  )
  async subscribe(@Body() subscriptionDto: SubscriptionDto): Promise<void> {
    return this.service.subscribe({
      chainId: subscriptionDto.chainId,
      safeAddress: subscriptionDto.safeAddress,
      account: subscriptionDto.account,
      categoryKey: subscriptionDto.categoryKey,
    });
  }

  @Delete()
  async unsubscribe(
    @Query('category') category: string,
    @Query('token', new ParseUUIDPipe()) token: string,
  ): Promise<void> {
    return this.service.unsubscribe({ categoryKey: category, token });
  }

  @Delete('all')
  async unsubscribeAll(
    @Query('token', new ParseUUIDPipe()) token: string,
  ): Promise<void> {
    return this.service.unsubscribeAll({ token });
  }
}
