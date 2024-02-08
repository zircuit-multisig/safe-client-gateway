import { INestApplication } from '@nestjs/common';
import { IAccountDataSource } from '@/domain/interfaces/account.datasource.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import configuration from '@/config/entities/__tests__/configuration';
import { EmailControllerModule } from '@/routes/email/email.controller.module';
import { AccountDataSourceModule } from '@/datasources/account/account.datasource.module';
import { TestAccountDataSourceModule } from '@/datasources/account/__tests__/test.account.datasource.module';
import { CacheModule } from '@/datasources/cache/cache.module';
import { TestCacheModule } from '@/datasources/cache/__tests__/test.cache.module';
import { RequestScopedLoggingModule } from '@/logging/logging.module';
import { TestLoggingModule } from '@/logging/__tests__/test.logging.module';
import { NetworkModule } from '@/datasources/network/network.module';
import { TestNetworkModule } from '@/datasources/network/__tests__/test.network.module';
import { TestAppProvider } from '@/__tests__/test-app.provider';
import * as request from 'supertest';
import { chainBuilder } from '@/domain/chains/entities/__tests__/chain.builder';
import { safeBuilder } from '@/domain/safe/entities/__tests__/safe.builder';
import { faker } from '@faker-js/faker';
import { accountBuilder } from '@/domain/account/entities/__tests__/account.builder';
import { AccountDoesNotExistError } from '@/domain/account/errors/account-does-not-exist.error';

describe('Email controller get email public tests', () => {
  let app: INestApplication;
  let accountDataSource: jest.MockedObjectDeep<IAccountDataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register(configuration), EmailControllerModule],
    })
      .overrideModule(AccountDataSourceModule)
      .useModule(TestAccountDataSourceModule)
      .overrideModule(CacheModule)
      .useModule(TestCacheModule)
      .overrideModule(RequestScopedLoggingModule)
      .useModule(TestLoggingModule)
      .overrideModule(NetworkModule)
      .useModule(TestNetworkModule)
      .compile();

    accountDataSource = moduleFixture.get(IAccountDataSource);

    app = await new TestAppProvider().provide(moduleFixture);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('existent verified email returns true', async () => {
    const chain = chainBuilder().build();
    const safe = safeBuilder().build();
    const signer = faker.finance.ethereumAddress();
    const account = accountBuilder()
      .with('signer', signer)
      .with('chainId', chain.chainId)
      .with('safeAddress', safe.address)
      .with('isVerified', true)
      .build();
    accountDataSource.getAccount.mockResolvedValue(account);

    await request(app.getHttpServer())
      .get(
        `/v1/chains/${chain.chainId}/safes/${safe.address}/emails/${signer}/public`,
      )
      .expect(200)
      .expect({ isEmailConfigured: true });

    expect(accountDataSource.getAccount).toHaveBeenCalledTimes(1);
    expect(accountDataSource.getAccount).toHaveBeenCalledWith({
      chainId: chain.chainId.toString(),
      safeAddress: safe.address,
      signer: signer,
    });
  });

  it('existent unverified email returns false', async () => {
    const chain = chainBuilder().build();
    const safe = safeBuilder().build();
    const signer = faker.finance.ethereumAddress();
    const account = accountBuilder()
      .with('signer', signer)
      .with('chainId', chain.chainId)
      .with('safeAddress', safe.address)
      .with('isVerified', false)
      .build();
    accountDataSource.getAccount.mockResolvedValue(account);

    await request(app.getHttpServer())
      .get(
        `/v1/chains/${chain.chainId}/safes/${safe.address}/emails/${signer}/public`,
      )
      .expect(200)
      .expect({ isEmailConfigured: false });

    expect(accountDataSource.getAccount).toHaveBeenCalledTimes(1);
    expect(accountDataSource.getAccount).toHaveBeenCalledWith({
      chainId: chain.chainId.toString(),
      safeAddress: safe.address,
      signer: signer,
    });
  });

  it('non-existent email returns false', async () => {
    const chain = chainBuilder().build();
    const safe = safeBuilder().build();
    const signer = faker.finance.ethereumAddress();
    accountDataSource.getAccount.mockRejectedValue(
      new AccountDoesNotExistError(chain.chainId, safe.address, signer),
    );

    await request(app.getHttpServer())
      .get(
        `/v1/chains/${chain.chainId}/safes/${safe.address}/emails/${signer}/public`,
      )
      .expect(200)
      .expect({ isEmailConfigured: false });

    expect(accountDataSource.getAccount).toHaveBeenCalledTimes(1);
    expect(accountDataSource.getAccount).toHaveBeenCalledWith({
      chainId: chain.chainId.toString(),
      safeAddress: safe.address,
      signer: signer,
    });
  });

  it('returns 500 on unknown error ', async () => {
    const chain = chainBuilder().build();
    const safe = safeBuilder().build();
    const signer = faker.finance.ethereumAddress();
    accountDataSource.getAccount.mockRejectedValue(
      new Error(
        `Some email error with sensitive data ${faker.internet.email()}`,
      ),
    );

    await request(app.getHttpServer())
      .get(
        `/v1/chains/${chain.chainId}/safes/${safe.address}/emails/${signer}/public`,
      )
      .expect(500)
      // Sensitive data such as email addresses should not be returned
      .expect({ code: 500, message: 'Internal server error' });

    expect(accountDataSource.getAccount).toHaveBeenCalledTimes(1);
    expect(accountDataSource.getAccount).toHaveBeenCalledWith({
      chainId: chain.chainId.toString(),
      safeAddress: safe.address,
      signer: signer,
    });
  });
});
