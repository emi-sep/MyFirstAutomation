interface EnvironmentConfig {
  BASE_URL: string;
}

interface TestCredentials {
  TEST_USERNAME: string;
  TEST_PASSWORD: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `[ENV CONFIG ERROR] Missing required environment variable: ${name}. ` +
      'Set it in your local .env file or in the execution environment.'
    );
  }

  return value;
}

function validateBaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }

    return url;
  } catch {
    throw new Error(
      `[ENV CONFIG ERROR] BASE_URL is invalid. ` +
      'Please provide a valid HTTP or HTTPS URL.'
    );
  }
}

export function getEnvironment(): EnvironmentConfig {
  return {
    BASE_URL: validateBaseUrl(getRequiredEnv('BASE_URL'))
  };
}

/**
 * Read credentials only from tests that require authentication.
 * Values are never included in validation errors.
 */
export function getTestCredentials(): TestCredentials {
  return {
    TEST_USERNAME: getRequiredEnv('TEST_USERNAME'),
    TEST_PASSWORD: getRequiredEnv('TEST_PASSWORD')
  };
}

