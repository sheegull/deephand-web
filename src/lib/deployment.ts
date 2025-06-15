// TDD Green Step: Minimal implementation to make tests pass

export interface DeploymentConfig {
  environment: 'production' | 'development' | 'staging';
  siteUrl: string;
  buildCommand: string;
  outputDirectory: string;
  nodeVersion: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
}

export interface BuildOutput {
  success: boolean;
  pages: string[];
  assets: string[];
  buildTime: number;
  bundleSize: number;
}

export interface BuildValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateDeploymentConfig(config: DeploymentConfig): ValidationResult {
  const errors: string[] = [];

  // Validate site URL
  try {
    new URL(config.siteUrl);
  } catch {
    errors.push('Invalid site URL format');
  }

  // Validate Node.js version
  const nodeVersion = parseFloat(config.nodeVersion);
  if (nodeVersion < 22.16) {
    errors.push('Node.js version must be 22.16.0 or higher');
  }

  // Validate environment
  const validEnvironments = ['production', 'development', 'staging'];
  if (!validEnvironments.includes(config.environment)) {
    errors.push('Invalid environment specified');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function checkRequiredEnvVars(
  envVars: Record<string, string | undefined>,
  environment: string
): EnvValidationResult {
  const missingVars: string[] = [];

  // Required for all environments
  const baseRequired = ['NODE_ENV', 'PUBLIC_SITE_URL'];

  // Additional required for production
  const productionRequired = ['RESEND_API_KEY', 'CLOUDFLARE_ANALYTICS_TOKEN'];

  // Check base required vars
  for (const varName of baseRequired) {
    if (!envVars[varName]) {
      missingVars.push(varName);
    }
  }

  // Check production-specific vars
  if (environment === 'production') {
    for (const varName of productionRequired) {
      if (!envVars[varName]) {
        missingVars.push(varName);
      }
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

export function validateBuildOutput(buildOutput: BuildOutput): BuildValidationResult {
  const errors: string[] = [];

  // Check if build was successful
  if (!buildOutput.success) {
    errors.push('Build failed');
  }

  // Check required pages exist
  const requiredPages = ['/', '/request-data'];
  for (const page of requiredPages) {
    if (!buildOutput.pages.includes(page)) {
      errors.push(`Missing required page: ${page}`);
    }
  }

  // Check bundle size (limit: 100KB)
  const bundleSizeLimitKB = 100 * 1024; // 100KB in bytes
  if (buildOutput.bundleSize > bundleSizeLimitKB) {
    const bundleSizeKB = Math.round(buildOutput.bundleSize / 1024);
    const limitKB = Math.round(bundleSizeLimitKB / 1024);
    errors.push(`Bundle size exceeds limit (${bundleSizeKB}KB > ${limitKB}KB)`);
  }

  // Check build time (limit: 60 seconds)
  const buildTimeLimitMs = 60 * 1000; // 60 seconds in ms
  if (buildOutput.buildTime > buildTimeLimitMs) {
    errors.push(`Build time exceeds limit (${buildOutput.buildTime}ms > ${buildTimeLimitMs}ms)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
