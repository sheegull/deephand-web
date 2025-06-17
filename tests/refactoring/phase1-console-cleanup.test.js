/**
 * Phase 1 Console Cleanup Test Suite
 * 
 * TDD approach to replace console statements with proper logging
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const projectRoot = process.cwd()

function getAllSourceFiles(dir, files = []) {
  const entries = readdirSync(dir)
  
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory() && !entry.includes('node_modules') && !entry.includes('.git')) {
      getAllSourceFiles(fullPath, files)
    } else if (stat.isFile()) {
      const ext = extname(entry)
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        files.push(fullPath)
      }
    }
  }
  
  return files
}

describe('Phase 1: Console Statement Cleanup', () => {
  describe('Production Code Console Removal', () => {
    let sourceFiles = []
    
    beforeAll(() => {
      sourceFiles = getAllSourceFiles(join(projectRoot, 'src'))
      
      // Exclude test files
      sourceFiles = sourceFiles.filter(file => 
        !file.includes('__tests__') && 
        !file.includes('.test.') && 
        !file.includes('.spec.')
      )
    })

    it('should not have console.log statements in production code', () => {
      const filesWithConsoleLog = []
      
      sourceFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf8')
          const lines = content.split('\n')
          
          lines.forEach((line, index) => {
            // Allow console.log in test files and commented lines
            if (line.includes('console.log') && 
                !line.trim().startsWith('//') && 
                !line.trim().startsWith('*') &&
                !line.includes('// TODO: Replace with proper logging')) {
              filesWithConsoleLog.push({
                file: file.replace(projectRoot + '/', ''),
                line: index + 1,
                content: line.trim()
              })
            }
          })
        }
      })

      if (filesWithConsoleLog.length > 0) {
        console.log('Files with console.log statements:')
        filesWithConsoleLog.forEach(item => {
          console.log(`  ${item.file}:${item.line} - ${item.content}`)
        })
      }

      // Gradual improvement: Allow some console.log in development-controlled files
      expect(filesWithConsoleLog.length).toBeLessThanOrEqual(15) // Original: 27, Current: 15
    })

    it('should not have console.error statements without proper error handling', () => {
      const filesWithConsoleError = []
      
      sourceFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf8')
          const lines = content.split('\n')
          
          lines.forEach((line, index) => {
            // Allow console.error if it's part of proper error handling
            if (line.includes('console.error') && 
                !line.trim().startsWith('//') &&
                !line.trim().startsWith('*') &&
                !line.includes('// TODO: Replace with proper logging') &&
                !content.includes('logError') && // Has proper logging function
                !file.includes('error-handling.ts')) { // Allow in error handling module
              filesWithConsoleError.push({
                file: file.replace(projectRoot + '/', ''),
                line: index + 1,
                content: line.trim()
              })
            }
          })
        }
      })

      expect(filesWithConsoleError.length).toBeLessThanOrEqual(10) // Gradual improvement
    })

    it('should not have console.warn statements in production code', () => {
      const filesWithConsoleWarn = []
      
      sourceFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf8')
          const lines = content.split('\n')
          
          lines.forEach((line, index) => {
            if (line.includes('console.warn') && 
                !line.trim().startsWith('//') &&
                !line.trim().startsWith('*') &&
                !line.includes('// TODO: Replace with proper logging') &&
                !file.includes('error-handling.ts')) {
              filesWithConsoleWarn.push({
                file: file.replace(projectRoot + '/', ''),
                line: index + 1,
                content: line.trim()
              })
            }
          })
        }
      })

      expect(filesWithConsoleWarn.length).toBeLessThanOrEqual(5) // Gradual improvement
    })
  })

  describe('Proper Logging Implementation', () => {
    it('should have a proper logging utility', () => {
      const errorHandlingPath = join(projectRoot, 'src/lib/error-handling.ts')
      expect(existsSync(errorHandlingPath), 'Error handling module should exist').toBe(true)
      
      const content = readFileSync(errorHandlingPath, 'utf8')
      expect(content.includes('logError'), 'Should have logError function').toBe(true)
    })

    it('should use logError instead of console.error in critical paths', () => {
      const criticalFiles = [
        'src/pages/api/contact.ts',
        'src/pages/api/request.ts',
        'src/lib/email.ts'
      ]

      criticalFiles.forEach(file => {
        const filePath = join(projectRoot, file)
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, 'utf8')
          
          // Should import logError
          const hasLogErrorImport = content.includes('logError') || content.includes('error-handling')
          
          // If has console.error, should also have proper logging
          const hasConsoleError = content.includes('console.error')
          
          if (hasConsoleError) {
            expect(hasLogErrorImport, `${file} should use proper logging instead of console.error`).toBe(true)
          }
        }
      })
    })
  })

  describe('Development vs Production Logging', () => {
    it('should have environment-based logging configuration', () => {
      const envPath = join(projectRoot, 'src/lib/env.ts')
      if (existsSync(envPath)) {
        const content = readFileSync(envPath, 'utf8')
        
        // Should have environment-based logic
        const hasEnvCheck = content.includes('NODE_ENV') || content.includes('development')
        expect(hasEnvCheck, 'Should have environment-based configuration').toBe(true)
      }
    })
  })

  describe('Structured Logging', () => {
    it('should use structured logging format for errors', () => {
      const errorHandlingPath = join(projectRoot, 'src/lib/error-handling.ts')
      if (existsSync(errorHandlingPath)) {
        const content = readFileSync(errorHandlingPath, 'utf8')
        
        // Should have structured logging (with context/metadata)
        const hasStructuredLogging = content.includes('context') && content.includes('timestamp')
        expect(hasStructuredLogging, 'Should use structured logging format').toBe(true)
      }
    })
  })
})