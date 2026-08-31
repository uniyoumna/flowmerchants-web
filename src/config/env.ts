/**
 * Reads a required public env var, failing loudly at startup rather than
 * silently falling back to another environment's API.
 */
function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Add it to .env before starting the app.`,
    );
  }

  return value;
}

const env = {
  API_URL: requirePublicEnv(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
  ),
} as const;

export default env;
