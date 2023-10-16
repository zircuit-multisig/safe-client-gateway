process.env.SAFE_CONFIG_BASE_URI = 'https://safe-config.staging.5afe.dev';
process.env.EXPIRATION_TIME_DEFAULT_SECONDS = `${60}`; // long enough timeout for cache state assertions
process.env.FF_HUMAN_DESCRIPTION = 'true';

// Set E2E tests database with the values of the test database
process.env.POSTGRES_HOST = process.env.POSTGRES_TEST_HOST || 'localhost';
process.env.POSTGRES_PORT = process.env.POSTGRES_TEST_PORT || '5433';
process.env.POSTGRES_DB = process.env.POSTGRES_TEST_DB || 'test-db';
process.env.POSTGRES_USER = process.env.POSTGRES_TEST_USER || 'postgres';
process.env.POSTGRES_PASSWORD =
  process.env.POSTGRES_TEST_PASSWORD || 'postgres';
