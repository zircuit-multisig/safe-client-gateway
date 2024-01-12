import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import configuration from '@/config/entities/__tests__/configuration';
import { EmailControllerModule } from '@/routes/email/email.controller.module';
import { EmailApiModule } from '@/datasources/email-api/email-api.module';
import { TestEmailApiModule } from '@/datasources/email-api/__tests__/test.email-api.module';
import { EmailDataSourceModule } from '@/datasources/email/email.datasource.module';
import { TestEmailDatasourceModule } from '@/datasources/email/__tests__/test.email.datasource.module';
import { CacheModule } from '@/datasources/cache/cache.module';
import { TestCacheModule } from '@/datasources/cache/__tests__/test.cache.module';
import { RequestScopedLoggingModule } from '@/logging/logging.module';
import { TestLoggingModule } from '@/logging/__tests__/test.logging.module';
import { NetworkModule } from '@/datasources/network/network.module';
import { TestNetworkModule } from '@/datasources/network/__tests__/test.network.module';
import { IEmailDataSource } from '@/domain/interfaces/email.datasource.interface';
import { TestAppProvider } from '@/__tests__/test-app.provider';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { Subscription } from '@/domain/email/entities/subscription.entity';

describe('Subscription Controller tests', () => {
  let app;
  let emailDatasource;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register(configuration), EmailControllerModule],
    })
      .overrideModule(EmailApiModule)
      .useModule(TestEmailApiModule)
      .overrideModule(EmailDataSourceModule)
      .useModule(TestEmailDatasourceModule)
      .overrideModule(CacheModule)
      .useModule(TestCacheModule)
      .overrideModule(RequestScopedLoggingModule)
      .useModule(TestLoggingModule)
      .overrideModule(NetworkModule)
      .useModule(TestNetworkModule)
      .compile();

    emailDatasource = moduleFixture.get(IEmailDataSource);

    app = await new TestAppProvider().provide(moduleFixture);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deletes category successfully', async () => {
    const subscriptionKey = faker.word.sample();
    const subscriptionName = faker.word.sample(2);
    const token = faker.string.uuid();
    const subscriptions = [
      {
        key: subscriptionKey,
        name: subscriptionName,
      },
    ] as Subscription[];
    emailDatasource.unsubscribe.mockResolvedValueOnce(subscriptions);

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/?category=${subscriptionKey}&token=${token}`)
      .expect(200)
      .expect({});

    expect(emailDatasource.unsubscribe).toHaveBeenCalledWith({
      categoryKey: subscriptionKey,
      token: token,
    });
    expect(emailDatasource.unsubscribeAll).toHaveBeenCalledTimes(0);
  });

  it('validates uuid format when deleting category', async () => {
    const subscriptionKey = faker.word.sample();
    const token = faker.string.hexadecimal();

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/?category=${subscriptionKey}&token=${token}`)
      .expect(400)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });

    expect(emailDatasource.unsubscribe).toHaveBeenCalledTimes(0);
    expect(emailDatasource.unsubscribeAll).toHaveBeenCalledTimes(0);
  });

  it('deleting category is not successful', async () => {
    const subscriptionKey = faker.word.sample();
    const token = faker.string.uuid();
    emailDatasource.unsubscribe.mockRejectedValueOnce(new Error('some error'));

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/?category=${subscriptionKey}&token=${token}`)
      .expect(500)
      .expect({ code: 500, message: 'Internal server error' });
  });

  it('deletes all categories successfully', async () => {
    const subscriptionKey = faker.word.sample();
    const subscriptionName = faker.word.sample(2);
    const token = faker.string.uuid();
    const subscriptions = [
      {
        key: subscriptionKey,
        name: subscriptionName,
      },
    ] as Subscription[];
    emailDatasource.unsubscribeAll.mockResolvedValueOnce(subscriptions);

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/all?token=${token}`)
      .expect(200)
      .expect({});

    expect(emailDatasource.unsubscribeAll).toHaveBeenCalledWith({
      token: token,
    });
    expect(emailDatasource.unsubscribe).toHaveBeenCalledTimes(0);
  });

  it('validates uuid format when deleting all categories', async () => {
    const subscriptionKey = faker.word.sample();
    const subscriptionName = faker.word.sample(2);
    const token = faker.string.hexadecimal();
    const subscriptions = [
      {
        key: subscriptionKey,
        name: subscriptionName,
      },
    ] as Subscription[];
    emailDatasource.unsubscribe.mockResolvedValueOnce(subscriptions);

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/all?token=${token}`)
      .expect(400)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });

    expect(emailDatasource.unsubscribe).toHaveBeenCalledTimes(0);
    expect(emailDatasource.unsubscribeAll).toHaveBeenCalledTimes(0);
  });

  it('deleting all categories is not successful', async () => {
    const token = faker.string.uuid();
    emailDatasource.unsubscribeAll.mockRejectedValueOnce(
      new Error('some error'),
    );

    await request(app.getHttpServer())
      .delete(`/v1/subscriptions/all?token=${token}`)
      .expect(500)
      .expect({ code: 500, message: 'Internal server error' });
  });
});
