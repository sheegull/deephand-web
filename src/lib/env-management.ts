// TDD Green Step: Environment variable management implementation

export interface EnvConfig {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  environment: 'development' | 'production' | 'test';
  requiredVars: Record<string, string>;
  optionalVars: Record<string, string>;
}

export interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  suggestions: string[];
}

// Define required and optional environment variables
const REQUIRED_VARS = {
  RESEND_API_KEY: 'Required for email functionality',
  PUBLIC_SITE_URL: 'Required for proper URL generation and email links',
};

const OPTIONAL_VARS = {
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: 'Optional but recommended for analytics tracking',
  NODE_ENV: 'Environment type (development/production/test)',
};

// Variable format validators
const VAR_VALIDATORS = {
  RESEND_API_KEY: (value: string) => value.startsWith('re_'),
  PUBLIC_SITE_URL: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: (value: string) => value.length > 0,
};

// Helpful suggestions for each variable
const VAR_SUGGESTIONS = {
  RESEND_API_KEY: 'Get RESEND_API_KEY from https://resend.com/api-keys',
  PUBLIC_SITE_URL: 'Set PUBLIC_SITE_URL to your domain (e.g., https://deephand.ai)',
  PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: 'Get token from Cloudflare Web Analytics dashboard',
};

export function getEnvironmentType(): 'development' | 'production' | 'test' {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();

  switch (nodeEnv) {
    case 'production':
      return 'production';
    case 'test':
      return 'test';
    case 'development':
    default:
      return 'development';
  }
}

export function validateEnvFormat(key: string, value: string): boolean {
  const validator = VAR_VALIDATORS[key as keyof typeof VAR_VALIDATORS];
  return validator ? validator(value) : true;
}

export function validateRequiredEnvVars(vars: string[]): EnvValidationResult {
  const missing: string[] = [];
  const invalid: string[] = [];
  const suggestions: string[] = [];

  for (const varName of vars) {
    const value = process.env[varName];

    if (!value) {
      missing.push(varName);
    } else if (!validateEnvFormat(varName, value)) {
      invalid.push(varName);
    }

    // Add suggestion if available
    if (VAR_SUGGESTIONS[varName as keyof typeof VAR_SUGGESTIONS]) {
      suggestions.push(VAR_SUGGESTIONS[varName as keyof typeof VAR_SUGGESTIONS]);
    }
  }

  return {
    isValid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    suggestions,
  };
}

export function validateEnvironmentVariables(): EnvConfig {
  const environment = getEnvironmentType();
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredVars: Record<string, string> = {};
  const optionalVars: Record<string, string> = {};

  // Check required variables
  for (const [varName, description] of Object.entries(REQUIRED_VARS)) {
    const value = process.env[varName];

    if (!value) {
      errors.push(`${varName} is required`);
    } else if (!validateEnvFormat(varName, value)) {
      if (varName === 'RESEND_API_KEY') {
        errors.push(`${varName} must start with "re_"`);
      } else if (varName === 'PUBLIC_SITE_URL') {
        errors.push(`${varName} must be a valid URL`);
      } else {
        errors.push(`${varName} has invalid format`);
      }
    } else {
      requiredVars[varName] = value;

      // Security warnings for required vars
      if (varName === 'RESEND_API_KEY' && value.includes('test')) {
        warnings.push(`${varName} appears to be a test/placeholder value`);
      }
      if (
        varName === 'PUBLIC_SITE_URL' &&
        value.startsWith('http://') &&
        environment === 'production'
      ) {
        warnings.push(`${varName} should use HTTPS in production`);
      }
    }
  }

  // Check optional variables
  for (const [varName, description] of Object.entries(OPTIONAL_VARS)) {
    const value = process.env[varName];

    if (!value) {
      if (environment === 'production' && varName === 'PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN') {
        // In production, analytics token becomes required
        errors.push(`${varName} is required in production`);
      } else {
        warnings.push(`${varName} is optional but recommended`);
      }
    } else {
      if (validateEnvFormat(varName, value)) {
        optionalVars[varName] = value;
      } else {
        warnings.push(`${varName} has invalid format but is optional`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    environment,
    requiredVars,
    optionalVars,
  };
}

export function generateEnvTemplate(): string {
  const template = `# DeepHand Environment Configuration
# Copy this file to .env.local and fill in your values

# ===== REQUIRED VARIABLES =====

# Required for email functionality
# Get from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Required for proper URL generation and email links
# Set to your domain (use https:// for production)
PUBLIC_SITE_URL=https://your-domain.com

# ===== OPTIONAL VARIABLES =====

# Optional but recommended for analytics tracking
# Get from Cloudflare Web Analytics dashboard
PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your_analytics_token_here

# Environment type (development/production/test)
# Usually set automatically by your deployment platform
NODE_ENV=development

# ===== DEVELOPMENT NOTES =====

# 1. Never commit actual API keys to version control
# 2. Use different values for development, staging, and production
# 3. Restart your development server after changing environment variables
# 4. For production deployment, set these in your platform's environment settings

# ===== GETTING STARTED =====

# 1. Sign up for Resend: https://resend.com/
# 2. Create an API key in your Resend dashboard
# 3. Set up Cloudflare Web Analytics (optional): https://dash.cloudflare.com/
# 4. Replace the placeholder values above with your actual values
# 5. Save this file as .env.local (this filename is in .gitignore)
`;

  return template;
}

// Utility function to check if environment is properly configured
export function isEnvironmentConfigured(): boolean {
  const config = validateEnvironmentVariables();
  return config.isValid;
}

// Utility function to get environment status for logging
export function getEnvironmentStatus(): string {
  const config = validateEnvironmentVariables();

  if (config.isValid) {
    return `✅ Environment configured (${config.environment})`;
  } else {
    return `❌ Environment configuration errors: ${config.errors.join(', ')}`;
  }
}

// Utility function to log environment validation results (development only)
export function logEnvironmentValidation(): void {
  const config = validateEnvironmentVariables();

  // Only log in development environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`🔧 Environment: ${config.environment}`);

    if (config.errors.length > 0) {
      console.error('❌ Configuration Errors:');
      config.errors.forEach(error => console.error(`  - ${error}`));
    }

    if (config.warnings.length > 0) {
      console.warn('⚠️  Configuration Warnings:');
      config.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    if (config.isValid) {
      console.log('✅ Environment configuration is valid');
    } else {
      console.error('❌ Environment configuration has errors');
    }
  }
}
