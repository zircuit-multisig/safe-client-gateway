import { Global, Module } from '@nestjs/common';
import { PostgresDatabaseModule } from '@/datasources/db/postgres-database.module';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';
import { EmailDatasource } from '@/datasources/email/email.datasource';

@Global()
@Module({
  imports: [PostgresDatabaseModule],
  providers: [{ provide: IEmailDataSource, useClass: EmailDatasource }],
  exports: [IEmailDataSource],
})
export class EmailDatasourceModule {}
