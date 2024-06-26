import { HttpErrorFactory } from '@/datasources/errors/http-error-factory';
import {
  NetworkRequestError,
  NetworkResponseError,
} from '@/datasources/network/entities/network.error.entity';
import { faker } from '@faker-js/faker';

describe('HttpErrorFactory', () => {
  const httpErrorFactory: HttpErrorFactory = new HttpErrorFactory();

  it('should create an DataSourceError when there is an error with the response', () => {
    const httpError = new NetworkResponseError(
      new URL(faker.internet.url()),
      {
        status: faker.internet.httpStatusCode({
          types: ['serverError', 'clientError'],
        }),
      } as Response,
      { message: faker.word.words() },
    );

    const actual = httpErrorFactory.from(httpError);

    expect(actual.code).toBe(httpError.response.status);
    expect(actual.message).toBe(
      (httpError.data as { message: string }).message,
    );
  });

  it('should create an DataSourceError with 503 status when there is an error with the request URL', () => {
    const httpError = new NetworkRequestError(null, undefined);

    const actual = httpErrorFactory.from(httpError);

    expect(actual.code).toBe(503);
    expect(actual.message).toBe('Service unavailable');
  });

  it('should create an DataSourceError with 503 status when there is an error with the request', () => {
    const httpError = new NetworkRequestError(
      new URL(faker.internet.url()),
      new Error('Failed to fetch'),
    );

    const actual = httpErrorFactory.from(httpError);

    expect(actual.code).toBe(503);
    expect(actual.message).toBe('Service unavailable');
  });

  it('should create an DataSourceError with 503 status when an arbitrary error happens', () => {
    const errMessage = 'Service unavailable';
    const randomError = new Error();

    const actual = httpErrorFactory.from(randomError);

    expect(actual.code).toBe(503);
    expect(actual.message).toBe(errMessage);
  });
});
