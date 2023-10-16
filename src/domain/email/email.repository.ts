import { Inject, Injectable } from '@nestjs/common';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';

@Injectable({})
export class EmailRepository {
  constructor(
    @Inject(IEmailDataSource) private readonly dataSource: IEmailDataSource,
  ) {}
}
