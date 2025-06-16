/**
 * Phase 1 Refactoring Test Suite: File Cleanup
 * 
 * TDD approach to ensure file cleanup doesn't break functionality
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, statSync } from 'fs'
import { join } from 'path'

const projectRoot = process.cwd()

describe('Phase 1: File Cleanup', () => {
  describe('Essential Files Preservation', () => {
    const essentialFiles = [
      'package.json',
      'tsconfig.json',
      'astro.config.mjs',
      'tailwind.config.js',
      'vitest.config.ts',
      'src/pages/index.astro',
      'src/pages/request.astro',
      'src/components/RequestDataPage.tsx',
      'src/components/HeroSection.tsx'
    ]

    essentialFiles.forEach(file => {
      it(`should preserve essential file: ${file}`, () => {
        const filePath = join(projectRoot, file)
        expect(existsSync(filePath), `File ${file} should exist`).toBe(true)
      })
    })
  })

  describe('Debug Files Cleanup', () => {
    const debugFiles = [
      'test-contact-form.js',
      'test-dotenv-fix.cjs',
      'test-email-config.js',
      'test-env-fix.cjs',
      'test-final-fix.cjs',
      'test-fixed-form.js',
      'test-form-validation.js',
      'test-syntax-fix.cjs',
      'debug-env.cjs'
    ]

    debugFiles.forEach(file => {
      it(`should remove debug file: ${file}`, () => {
        const filePath = join(projectRoot, file)
        // This test will fail initially, then pass after cleanup
        expect(existsSync(filePath), `Debug file ${file} should be removed`).toBe(false)
      })
    })
  })

  describe('Backup Files Cleanup', () => {
    it('should remove DataRequestForm.tsx.backup', () => {
      const backupFile = join(projectRoot, 'src/components/islands/DataRequestForm.tsx.backup')
      expect(existsSync(backupFile), 'Backup file should be removed').toBe(false)
    })
  })

  describe('Font Files Deduplication', () => {
    const fontDir = join(projectRoot, 'public/fonts')
    const subFontDir = join(projectRoot, 'public/fonts/AllianceFontFamily')

    it('should have fonts only in main directory OR subdirectory, not both', () => {
      if (existsSync(fontDir) && existsSync(subFontDir)) {
        const mainDirFiles = require('fs').readdirSync(fontDir).filter(f => f.endsWith('.ttf'))
        const subDirFiles = require('fs').readdirSync(subFontDir).filter(f => f.endsWith('.ttf'))
        
        // Either main directory should be empty (fonts moved to subdirectory)
        // OR subdirectory should be removed (fonts kept in main directory)
        const hasMainFonts = mainDirFiles.length > 0
        const hasSubFonts = subDirFiles.length > 0
        
        expect(hasMainFonts && hasSubFonts, 'Should not have duplicate fonts in both directories').toBe(false)
      }
    })

    it('should maintain at least one copy of each font variant', () => {
      const expectedFonts = [
        'AllianceNo1-Regular.ttf',
        'AllianceNo1-Bold.ttf',
        'AllianceNo1-Medium.ttf',
        'AllianceNo2-Regular.ttf',
        'AllianceNo2-Bold.ttf'
      ]

      let foundFonts = []
      
      // Check main directory
      if (existsSync(fontDir)) {
        const mainFiles = require('fs').readdirSync(fontDir).filter(f => f.endsWith('.ttf'))
        foundFonts = foundFonts.concat(mainFiles)
      }
      
      // Check subdirectory
      if (existsSync(subFontDir)) {
        const subFiles = require('fs').readdirSync(subFontDir).filter(f => f.endsWith('.ttf'))
        foundFonts = foundFonts.concat(subFiles)
      }

      expectedFonts.forEach(font => {
        expect(foundFonts.includes(font), `Font ${font} should exist somewhere`).toBe(true)
      })
    })
  })

  describe('Test Files Organization', () => {
    const testsDir = join(projectRoot, 'tests')
    const rootTestFiles = [
      'dotenv-failure-fix.test.js',
      'astro-config-fix.test.js', 
      'contact-form-fix.test.js',
      'env-syntax-fix.test.js',
      'eslint-config-fix.test.js'
    ]

    it('should have tests directory', () => {
      expect(existsSync(testsDir), 'tests/ directory should exist').toBe(true)
    })

    rootTestFiles.forEach(testFile => {
      it(`should have ${testFile} in tests directory`, () => {
        const testPath = join(testsDir, testFile)
        expect(existsSync(testPath), `Test file ${testFile} should be in tests/ directory`).toBe(true)
      })

      it(`should not have ${testFile} in root directory`, () => {
        const rootPath = join(projectRoot, testFile)
        expect(existsSync(rootPath), `Test file ${testFile} should not be in root directory`).toBe(false)
      })
    })
  })

  describe('Build Integrity', () => {
    it('should still be able to build successfully after cleanup', async () => {
      // This test ensures that removing files doesn't break the build
      const { exec } = await import('child_process')
      const { promisify } = await import('util')
      const execAsync = promisify(exec)

      try {
        await execAsync('npm run build', { cwd: projectRoot })
        expect(true).toBe(true) // Build succeeded
      } catch (error) {
        expect.fail(`Build failed after cleanup: ${error.message}`)
      }
    }, 30000) // 30 second timeout for build
  })
})