import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
  @ApiProperty()
  chainId: string;

  @ApiProperty()
  safeAddress: string;

  @ApiProperty()
  account: string;

  @ApiProperty()
  categoryKey: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  timestamp: number;
}
