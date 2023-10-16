import { Global, Module } from '@nestjs/common';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';

const emailDatasource = <IEmailDataSource>{
  saveEmail: jest.fn(),
  updateVerificationCode: jest.fn(),
  verifyEmail: jest.fn(),
};

@Global()
@Module({
  providers: [
    {
      provide: IEmailDataSource,
      useFactory: () => {
        return jest.mocked(emailDatasource);
      },
    },
  ],
  exports: [IEmailDataSource],
})
export class TestEmailDatasourceModule {}
