import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { validatePreDeployment, executeBuild, validateBuildArtifacts } from '../deployment-process';

// Mock child_process for safe testing
vi.mock('child_process', async importOriginal => {
  const actual = await importOriginal<typeof import('child_process')>();
  return {
    ...actual,
    execSync: vi.fn(),
  };
});

vi.mock('fs', async importOriginal => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    existsSync: vi.fn(),
    statSync: vi.fn(),
  };
});

describe('Deployment Process', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validatePreDeployment', () => {
    it('should validate all pre-deployment requirements', async () => {
      // Mock successful validations
      vi.mocked(execSync)
        .mockReturnValueOnce('22.16.0\n') // node --version
        .mockReturnValueOnce('10.11.1\n') // pnpm --version
        .mockReturnValueOnce('4.20.0\n'); // wrangler --version

      const result = await validatePreDeployment();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.checks).toEqual({
        nodeVersion: '22.16.0',
        pnpmVersion: '10.11.1',
        wranglerVersion: '4.20.0',
        envVarsValid: true,
        gitClean: true,
      });
    });

    it('should fail validation for wrong Node.js version', async () => {
      vi.mocked(execSync)
        .mockReturnValueOnce('18.0.0\n') // wrong node version
        .mockReturnValueOnce('10.11.1\n') // pnpm --version
        .mockReturnValueOnce('4.20.0\n'); // wrangler --version

      const result = await validatePreDeployment();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Node.js version 18.0.0 is not supported. Required: 22.16.0+'
      );
    });

    it('should fail validation when required tools are missing', async () => {
      vi.mocked(execSync).mockImplementationOnce(() => {
        throw new Error('command not found');
      });

      const result = await validatePreDeployment();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Node.js is not installed or not accessible');
    });
  });

  describe('executeBuild', () => {
    it('should successfully execute build process', async () => {
      const mockBuildOutput = `
        ✓ Completed in 95ms.
        ✓ Completed in 468ms.
        dist/_astro/LanguageSwitcher.0JyBS84l.js    1.15 kB │ gzip:  0.68 kB
        dist/_astro/client.BxCTEn3I.js            179.41 kB │ gzip: 56.60 kB
        ✓ built in 815ms
        2 page(s) built in 1.45s
      `;

      vi.mocked(execSync).mockReturnValueOnce(mockBuildOutput);

      const result = await executeBuild();

      expect(result.success).toBe(true);
      expect(result.buildTime).toBeLessThan(60000); // Under 60 seconds
      expect(result.bundleSize).toBeLessThan(100 * 1024); // Under 100KB gzipped
    });

    it('should handle build failures gracefully', async () => {
      vi.mocked(execSync).mockImplementationOnce(() => {
        throw new Error('Build failed: TypeScript errors');
      });

      const result = await executeBuild();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Build failed: TypeScript errors');
    });

    it('should fail if build time exceeds limit', async () => {
      vi.mocked(execSync).mockImplementationOnce(() => {
        // Simulate long build
        return 'Build completed in 90 seconds';
      });

      const result = await executeBuild({ timeout: 30000 }); // 30 second limit

      expect(result.success).toBe(false);
      expect(result.error).toContain('Build timeout exceeded');
    });
  });

  describe('validateBuildArtifacts', () => {
    it('should validate all required build artifacts exist', () => {
      // Mock file existence checks
      vi.mocked(existsSync)
        .mockReturnValueOnce(true) // dist directory
        .mockReturnValueOnce(true) // index.html
        .mockReturnValueOnce(true) // request-data/index.html
        .mockReturnValueOnce(true) // _astro directory
        .mockReturnValueOnce(true); // assets exist

      const result = validateBuildArtifacts();

      expect(result.isValid).toBe(true);
      expect(result.missingFiles).toHaveLength(0);
    });

    it('should identify missing required files', () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(true) // dist directory exists
        .mockReturnValueOnce(false) // index.html missing
        .mockReturnValueOnce(false) // request-data/index.html missing
        .mockReturnValueOnce(true) // _astro directory exists
        .mockReturnValueOnce(true); // assets exist

      const result = validateBuildArtifacts();

      expect(result.isValid).toBe(false);
      expect(result.missingFiles).toContain('dist/index.html');
      expect(result.missingFiles).toContain('dist/request-data/index.html');
    });

    it('should validate asset bundle sizes', () => {
      vi.mocked(existsSync).mockReturnValue(true);

      // Mock fs.statSync for file sizes
      const mockStatSync = vi
        .fn()
        .mockReturnValueOnce({ size: 50000 }) // CSS file: 50KB
        .mockReturnValueOnce({ size: 180000 }) // JS file: 180KB
        .mockReturnValueOnce({ size: 60000 }); // Bundle: 60KB gzipped

      vi.doMock('fs', () => ({
        existsSync: vi.mocked(existsSync),
        statSync: mockStatSync,
      }));

      const result = validateBuildArtifacts();

      expect(result.isValid).toBe(true);
      expect(result.bundleAnalysis.totalSize).toBeLessThan(300000); // Under 300KB total
    });
  });
});
