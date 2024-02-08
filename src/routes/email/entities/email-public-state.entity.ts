import { ApiProperty } from '@nestjs/swagger';

export class EmailPublicState {
  @ApiProperty()
  isEmailConfigured: boolean;

  constructor(emailConfigured: boolean) {
    this.isEmailConfigured = emailConfigured;
  }
}
