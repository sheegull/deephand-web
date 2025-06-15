// TDD Green Step: Cloudflare Web Analytics implementation

export interface AnalyticsConfig {
  isEnabled: boolean;
  token: string;
  siteUrl: string;
  hasValidConfig: boolean;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

// Global analytics state
let analyticsInitialized = false;
let analyticsConfig: AnalyticsConfig | null = null;

export function validateAnalyticsConfig(): AnalyticsConfig {
  const token = process.env.PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '';
  const siteUrl = process.env.PUBLIC_SITE_URL || '';

  const isEnabled = !!token;
  const hasValidConfig = isEnabled && !!siteUrl;

  const config: AnalyticsConfig = {
    isEnabled,
    token,
    siteUrl,
    hasValidConfig,
  };

  analyticsConfig = config;
  return config;
}

export function initializeAnalytics(): boolean {
  try {
    const config = validateAnalyticsConfig();

    if (!config.hasValidConfig) {
      console.warn('Analytics configuration is invalid, skipping initialization');
      return false;
    }

    // Initialize Cloudflare Web Analytics
    if (typeof window !== 'undefined') {
      // Client-side initialization
      analyticsInitialized = true;
      console.log('Cloudflare Web Analytics initialized');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
    return false;
  }
}

export function trackEvent(event: AnalyticsEvent): boolean {
  try {
    const config = analyticsConfig || validateAnalyticsConfig();

    if (!config.hasValidConfig || !event.name.trim()) {
      return false;
    }

    // Validate event data
    if (!event.name || event.name.trim() === '') {
      return false;
    }

    // In a real implementation, this would send to Cloudflare Analytics
    // For now, we'll log the event
    console.log('Analytics Event:', {
      name: event.name,
      properties: event.properties,
      timestamp: event.timestamp,
    });

    return true;
  } catch (error) {
    console.error('Failed to track event:', error);
    return false;
  }
}

export function trackPageView(path: string): boolean {
  try {
    const config = analyticsConfig || validateAnalyticsConfig();

    if (!config.hasValidConfig || !path.trim()) {
      return false;
    }

    // Validate path
    if (!path || path.trim() === '') {
      return false;
    }

    const event: AnalyticsEvent = {
      name: 'page_view',
      properties: {
        path,
        url: `${config.siteUrl}${path}`,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      },
      timestamp: Date.now(),
    };

    // Use the same validation logic as trackEvent but inline to avoid circular dependency
    if (!config.hasValidConfig || !event.name.trim()) {
      return false;
    }

    console.log('Analytics Event:', {
      name: event.name,
      properties: event.properties,
      timestamp: event.timestamp,
    });

    return true;
  } catch (error) {
    console.error('Failed to track page view:', error);
    return false;
  }
}

export function generateAnalyticsScript(): string {
  try {
    const config = validateAnalyticsConfig();

    if (!config.hasValidConfig) {
      return '';
    }

    // Generate Cloudflare Web Analytics script
    return `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${config.token}"}'></script>`;
  } catch (error) {
    console.error('Failed to generate analytics script:', error);
    return '';
  }
}

// Convenience functions for common tracking scenarios
export function trackFormSubmission(formType: string, additionalData?: Record<string, any>) {
  return trackEvent({
    name: 'form_submit',
    properties: {
      formType,
      ...additionalData,
    },
    timestamp: Date.now(),
  });
}

export function trackContactFormSubmission(data: { email: string; subject: string }) {
  return trackFormSubmission('contact', {
    hasEmail: !!data.email,
    subject: data.subject,
    // Don't track actual email for privacy
  });
}

export function trackDataRequestSubmission(data: {
  projectTitle: string;
  dataType: string;
  dataVolume: string;
}) {
  return trackFormSubmission('data_request', {
    projectTitle: data.projectTitle,
    dataType: data.dataType,
    dataVolume: data.dataVolume,
  });
}

// Analytics component integration helpers
export function getAnalyticsProps() {
  const config = validateAnalyticsConfig();

  return {
    isEnabled: config.isEnabled,
    token: config.token,
    script: generateAnalyticsScript(),
  };
}
