export interface EnvironmentConfig {
  BASE_URL: string;
  DEMOQA_BASE_URL: string;
  allowDestructiveCleanup: boolean;
}

export interface TestCredentials {
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

function getOptionalBooleanEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) {
    return defaultValue;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(`[ENV CONFIG ERROR] ${name} must be either "true" or "false".`);
}

function validateBaseUrl(name: string, url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url;
  } catch {
    throw new Error(`[ENV CONFIG ERROR] ${name} is invalid. Provide a valid HTTP or HTTPS URL.`);
  }
}

export function getEnvironment(): EnvironmentConfig {
  return {
    BASE_URL: validateBaseUrl('BASE_URL', getRequiredEnv('BASE_URL')),
    DEMOQA_BASE_URL: validateBaseUrl(
      'DEMOQA_BASE_URL',
      process.env.DEMOQA_BASE_URL?.trim() || 'https://demoqa.com'
    ),
    allowDestructiveCleanup: getOptionalBooleanEnv('ALLOW_DESTRUCTIVE_CLEANUP', false)
  };
}

/** Read private credentials only for flows that require them. */
export function getTestCredentials(): TestCredentials {
  return {
    TEST_USERNAME: getRequiredEnv('TEST_USERNAME'),
    TEST_PASSWORD: getRequiredEnv('TEST_PASSWORD')
  };
}
