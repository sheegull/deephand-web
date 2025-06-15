// TDD Green Step: CI/CD configuration implementation

import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import path from 'path';

export interface CICDConfig {
  hasWorkflow: boolean;
  workflowName: string;
  triggers: string[];
  jobs: string[];
  nodeVersion: string;
  hasEnvironmentVars: boolean;
  hasDeploymentStep: boolean;
}

export function validateCICDWorkflow(): CICDConfig {
  const workflowPath = '.github/workflows/ci-cd.yml';

  if (!existsSync(workflowPath)) {
    return {
      hasWorkflow: false,
      workflowName: '',
      triggers: [],
      jobs: [],
      nodeVersion: '',
      hasEnvironmentVars: false,
      hasDeploymentStep: false,
    };
  }

  try {
    const content = readFileSync(workflowPath, 'utf-8');

    // Parse basic workflow information
    const hasWorkflow = content.includes('name:');
    const workflowName = extractWorkflowName(content);
    const triggers = extractTriggers(content);
    const jobs = extractJobs(content);
    const nodeVersion = extractNodeVersion(content);
    const hasEnvironmentVars = content.includes('secrets.') || content.includes('env:');
    const hasDeploymentStep = content.includes('wrangler') || content.includes('deploy');

    return {
      hasWorkflow,
      workflowName,
      triggers,
      jobs,
      nodeVersion,
      hasEnvironmentVars,
      hasDeploymentStep,
    };
  } catch (error) {
    return {
      hasWorkflow: false,
      workflowName: '',
      triggers: [],
      jobs: [],
      nodeVersion: '',
      hasEnvironmentVars: false,
      hasDeploymentStep: false,
    };
  }
}

export function validateGitHubActionsFile(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) {
      return false;
    }

    const content = readFileSync(filePath, 'utf-8');

    // Basic YAML validation - check for required GitHub Actions structure
    const hasName = content.includes('name:');
    const hasOn = content.includes('on:') || content.includes('on ');
    const hasJobs = content.includes('jobs:');

    return hasName && hasOn && hasJobs;
  } catch (error) {
    return false;
  }
}

// Helper functions for parsing workflow content
function extractWorkflowName(content: string): string {
  const match = content.match(/name:\s*(.+)/);
  return match ? match[1].trim() : '';
}

function extractTriggers(content: string): string[] {
  const triggers: string[] = [];

  if (content.includes('push:') || content.includes('- push')) {
    triggers.push('push');
  }
  if (content.includes('pull_request:') || content.includes('- pull_request')) {
    triggers.push('pull_request');
  }
  if (content.includes('schedule:')) {
    triggers.push('schedule');
  }
  if (content.includes('workflow_dispatch:')) {
    triggers.push('workflow_dispatch');
  }

  return triggers;
}

function extractJobs(content: string): string[] {
  const jobs: string[] = [];

  // Look for job definitions
  const jobMatches = content.match(/^\s*([a-zA-Z_-]+):\s*$/gm);

  if (jobMatches) {
    for (const match of jobMatches) {
      const jobName = match.replace(':', '').trim();
      if (jobName !== 'jobs' && jobName !== 'on' && jobName !== 'env') {
        jobs.push(jobName);
      }
    }
  }

  // Also check for common job names in content
  if (content.includes('test') || content.includes('Test')) {
    if (!jobs.includes('test')) jobs.push('test');
  }
  if (content.includes('build') || content.includes('Build')) {
    if (!jobs.includes('build')) jobs.push('build');
  }
  if (content.includes('deploy') || content.includes('Deploy')) {
    if (!jobs.includes('deploy')) jobs.push('deploy');
  }

  return jobs;
}

function extractNodeVersion(content: string): string {
  // First try to find NODE_VERSION environment variable definition
  const envMatch = content.match(/NODE_VERSION:\s*['"]?([^'"\\s]+)['"]?/);
  if (envMatch) {
    return envMatch[1];
  }

  // Fallback to direct node-version specification
  const nodeMatch = content.match(/node-version:\s*['"]?([^'"\\s$]+)['"]?/);
  return nodeMatch ? nodeMatch[1] : '';
}
