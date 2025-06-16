/**
 * Phase 2 Component Structure Test Suite
 * 
 * TDD approach to ensure component structure unification
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const projectRoot = process.cwd()

function getAllComponentFiles(dir, files = []) {
  const entries = readdirSync(dir)
  
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory() && !entry.includes('node_modules') && !entry.includes('.git')) {
      getAllComponentFiles(fullPath, files)
    } else if (stat.isFile()) {
      const ext = extname(entry)
      if (['.tsx', '.ts'].includes(ext) && !entry.includes('.test.') && !entry.includes('.spec.')) {
        files.push(fullPath)
      }
    }
  }
  
  return files
}

describe('Phase 2: Component Structure Unification', () => {
  let componentFiles = []
  
  beforeAll(() => {
    componentFiles = getAllComponentFiles(join(projectRoot, 'src/components'))
  })

  describe('Directory Structure Standards', () => {
    it('should have a clear ui/ directory for basic UI components', () => {
      const uiDir = join(projectRoot, 'src/components/ui')
      expect(existsSync(uiDir), 'src/components/ui directory should exist').toBe(true)
    })

    it('should not have both common/ and ui/ with overlapping components', () => {
      const commonDir = join(projectRoot, 'src/components/common')
      const uiDir = join(projectRoot, 'src/components/ui')
      
      if (existsSync(commonDir) && existsSync(uiDir)) {
        const commonFiles = readdirSync(commonDir).filter(f => f.endsWith('.tsx'))
        const uiFiles = readdirSync(uiDir).filter(f => f.endsWith('.tsx'))
        
        // Check for overlapping component names (ignoring case differences)
        const overlapping = []
        commonFiles.forEach(commonFile => {
          const commonName = commonFile.toLowerCase().replace('.tsx', '')
          uiFiles.forEach(uiFile => {
            const uiName = uiFile.toLowerCase().replace('.tsx', '')
            if (commonName === uiName) {
              overlapping.push({ common: commonFile, ui: uiFile })
            }
          })
        })

        expect(overlapping, `Found overlapping components: ${JSON.stringify(overlapping)}`).toHaveLength(0)
      }
    })

    it('should have standardized import paths', () => {
      const problematicImports = []
      
      componentFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf8')
          const lines = content.split('\n')
          
          lines.forEach((line, index) => {
            // Check for relative imports that should be absolute
            if (line.includes("import") && line.includes("../") && line.includes("components")) {
              problematicImports.push({
                file: file.replace(projectRoot + '/', ''),
                line: index + 1,
                content: line.trim()
              })
            }
          })
        }
      })

      // Allow some relative imports but encourage absolute imports
      expect(problematicImports.length).toBeLessThanOrEqual(5)
    })
  })

  describe('Button Component Unification', () => {
    it('should have only one primary Button component', () => {
      const buttonComponents = componentFiles.filter(file => 
        file.toLowerCase().includes('button') && !file.includes('__tests__')
      )

      // Should have ui/button.tsx as the primary component
      const uiButton = join(projectRoot, 'src/components/ui/button.tsx')
      expect(existsSync(uiButton), 'Should have ui/button.tsx as primary Button component').toBe(true)

      // Should not have duplicate Button in common/
      const commonButton = join(projectRoot, 'src/components/common/Button.tsx')
      expect(existsSync(commonButton), 'Should not have duplicate Button in common/').toBe(false)
    })

    it('should have consistent Button component interface', () => {
      const uiButton = join(projectRoot, 'src/components/ui/button.tsx')
      if (existsSync(uiButton)) {
        const content = readFileSync(uiButton, 'utf8')
        
        // Should export a Button component
        expect(content.includes('export') && (content.includes('Button') || content.includes('button')), 'Should export Button component').toBe(true)
        
        // Should have proper TypeScript interface
        expect(content.includes('interface') || content.includes('type'), 'Should have TypeScript interface/type').toBe(true)
      }
    })
  })

  describe('Card Component Unification', () => {
    it('should have only one primary Card component', () => {
      const uiCard = join(projectRoot, 'src/components/ui/card.tsx')
      expect(existsSync(uiCard), 'Should have ui/card.tsx as primary Card component').toBe(true)

      const commonCard = join(projectRoot, 'src/components/common/Card.tsx')
      expect(existsSync(commonCard), 'Should not have duplicate Card in common/').toBe(false)
    })

    it('should have consistent Card component exports', () => {
      const uiCard = join(projectRoot, 'src/components/ui/card.tsx')
      if (existsSync(uiCard)) {
        const content = readFileSync(uiCard, 'utf8')
        
        // Should export Card, CardHeader, CardContent, etc.
        const expectedExports = ['Card', 'CardContent']
        expectedExports.forEach(exportName => {
          expect(content.includes(exportName), `Should export ${exportName}`).toBe(true)
        })
      }
    })
  })

  describe('Layout Component Consistency', () => {
    it('should have clear separation between layout components', () => {
      const baseLayout = join(projectRoot, 'src/layouts/BaseLayout.astro')
      const layout = join(projectRoot, 'src/layouts/Layout.astro')
      
      if (existsSync(baseLayout) && existsSync(layout)) {
        const baseContent = readFileSync(baseLayout, 'utf8')
        const layoutContent = readFileSync(layout, 'utf8')
        
        // Should have different purposes - not duplicates
        expect(baseContent !== layoutContent, 'Layout files should have different content').toBe(true)
      }
    })
  })

  describe('Utility Functions Centralization', () => {
    it('should have centralized cn utility function', () => {
      const utilsFile = join(projectRoot, 'src/lib/utils.ts')
      expect(existsSync(utilsFile), 'Should have src/lib/utils.ts').toBe(true)
      
      if (existsSync(utilsFile)) {
        const content = readFileSync(utilsFile, 'utf8')
        expect(content.includes('cn'), 'Should export cn function').toBe(true)
      }
    })

    it('should not have duplicate cn functions in components', () => {
      const duplicateCnFiles = []
      
      componentFiles.forEach(file => {
        if (existsSync(file) && !file.includes('utils.ts')) {
          const content = readFileSync(file, 'utf8')
          
          // Check for inline cn function definitions
          if (content.includes('function cn') || content.includes('const cn')) {
            duplicateCnFiles.push(file.replace(projectRoot + '/', ''))
          }
        }
      })

      expect(duplicateCnFiles, `Found duplicate cn functions in: ${duplicateCnFiles.join(', ')}`).toHaveLength(0)
    })

    it('should import cn from centralized location', () => {
      const filesWithCnImport = []
      const filesWithLocalCn = []
      
      componentFiles.forEach(file => {
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf8')
          
          if (content.includes('cn(') || content.includes('cn ')) {
            if (content.includes("import") && content.includes("cn") && content.includes("utils")) {
              filesWithCnImport.push(file.replace(projectRoot + '/', ''))
            } else if (!content.includes("import") || !content.includes("utils")) {
              filesWithLocalCn.push(file.replace(projectRoot + '/', ''))
            }
          }
        }
      })

      // Files using cn should import it from utils
      expect(filesWithLocalCn, `Files should import cn from utils, found local cn in: ${filesWithLocalCn.join(', ')}`).toHaveLength(0)
    })
  })

  describe('Build and Type Safety', () => {
    it('should build Astro project successfully after component unification', async () => {
      const { exec } = await import('child_process')
      const { promisify } = await import('util')
      const execAsync = promisify(exec)

      try {
        await execAsync('npm run build', { cwd: projectRoot })
        expect(true).toBe(true) // Astro build succeeded
      } catch (error) {
        expect.fail(`Astro build failed after component unification: ${error.message}`)
      }
    }, 30000)
  })
})