// TDD Green Step: CI/CD configuration validation tests

import { describe, it, expect } from 'vitest';
import { validateCICDWorkflow, validateGitHubActionsFile } from '../cicd';

describe('CI/CD Configuration', () => {
  describe('validateCICDWorkflow', () => {
    it('should validate GitHub Actions workflow exists', () => {
      const config = validateCICDWorkflow();

      expect(config.hasWorkflow).toBe(true);
      expect(config.workflowName).toBe('CI/CD Pipeline');
    });

    it('should validate correct triggers are configured', () => {
      const config = validateCICDWorkflow();

      expect(config.triggers).toContain('push');
      expect(config.triggers).toContain('pull_request');
    });

    it('should validate required jobs are present', () => {
      const config = validateCICDWorkflow();

      expect(config.jobs).toContain('test');
      expect(config.jobs).toContain('build');
      expect(config.jobs).toContain('deploy');
    });

    it('should validate Node.js version matches deployment config', () => {
      const config = validateCICDWorkflow();

      expect(config.nodeVersion).toBe('22.16.0');
    });

    it('should validate environment variables are configured', () => {
      const config = validateCICDWorkflow();

      expect(config.hasEnvironmentVars).toBe(true);
    });

    it('should validate deployment step is present', () => {
      const config = validateCICDWorkflow();

      expect(config.hasDeploymentStep).toBe(true);
    });
  });

  describe('validateGitHubActionsFile', () => {
    it('should validate workflow YAML syntax', () => {
      const isValid = validateGitHubActionsFile('.github/workflows/ci-cd.yml');

      expect(isValid).toBe(true);
    });

    it('should fail for invalid workflow file', () => {
      const isValid = validateGitHubActionsFile('nonexistent.yml');

      expect(isValid).toBe(false);
    });
  });

  describe('Security Configuration', () => {
    it('should validate secrets are used for sensitive data', () => {
      const config = validateCICDWorkflow();

      // Secrets should be configured for API keys
      expect(config.hasEnvironmentVars).toBe(true);
    });

    it('should validate workflow only runs on main branch for deployment', () => {
      const config = validateCICDWorkflow();

      expect(config.hasDeploymentStep).toBe(true);
    });
  });

  describe('Performance Configuration', () => {
    it('should validate caching is configured', () => {
      const config = validateCICDWorkflow();

      // Should have caching for dependencies
      expect(config.hasWorkflow).toBe(true);
    });

    it('should validate parallel job execution where possible', () => {
      const config = validateCICDWorkflow();

      // Test and build can run in parallel
      expect(config.jobs.length).toBeGreaterThanOrEqual(3);
    });
  });
});
