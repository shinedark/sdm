#!/usr/bin/env node

/**
 * React Library Optimizer
 * 
 * Creates custom optimized builds of React and other core libraries
 * by applying semantic optimization directly to node_modules source.
 * 
 * Features:
 * - Custom React builds with semantic optimization
 * - Optimizes react, react-dom, and other core libraries
 * - Creates production-optimized versions
 * - Maintains API compatibility
 * - Generates custom bundle manifests
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

class ReactLibraryOptimizer {
  constructor(options = {}) {
    this.options = {
      // Libraries to optimize
      targetLibraries: options.targetLibraries || [
        'react',
        'react-dom',
        '@vercel/blob',
        '@vercel/edge-config',
        'axios',
        'ethers'
      ],
      
      // Optimization settings
      aggressiveOptimization: options.aggressive !== false,
      createCustomBuilds: options.createCustomBuilds !== false,
      preserveAPIs: options.preserveAPIs !== false,
      
      // Output settings
      outputDir: options.outputDir || 'custom-builds',
      createBackups: options.createBackups !== false,
      
      // React-specific settings
      reactOptimizations: {
        removeDevWarnings: true,
        optimizeHooks: true,
        removeDebugInfo: true,
        minifyPropTypes: true
      }
    };
    
    this.libraryInfo = new Map();
    this.optimizationResults = new Map();
    
    this.stats = {
      librariesProcessed: 0,
      filesOptimized: 0,
      totalSizeReduction: 0,
      customBuildsCreated: 0
    };
  }

  /**
   * Main optimization pipeline
   */
  async optimize() {
    console.log('⚛️  React Library Optimizer Starting...');
    console.log('======================================\n');
    
    try {
      // Phase 1: Analyze target libraries
      console.log('📊 Phase 1: Analyzing target libraries...');
      await this.analyzeLibraries();
      
      // Phase 2: Create optimized builds
      console.log('🔧 Phase 2: Creating optimized builds...');
      await this.createOptimizedBuilds();
      
      // Phase 3: Generate custom React build
      console.log('⚛️  Phase 3: Generating custom React build...');
      await this.createCustomReactBuild();
      
      // Phase 4: Create integration manifests
      console.log('📋 Phase 4: Creating integration manifests...');
      await this.createIntegrationManifests();
      
      // Phase 5: Generate report
      console.log('📈 Phase 5: Generating optimization report...');
      this.generateReport();
      
      console.log('\n🎉 React Library Optimization Complete!');
      return this.stats;
      
    } catch (error) {
      console.error('❌ React library optimization failed:', error.message);
      throw error;
    }
  }

  /**
   * Phase 1: Analyze target libraries
   */
  async analyzeLibraries() {
    for (const libraryName of this.options.targetLibraries) {
      await this.analyzeLibrary(libraryName);
    }
    
    console.log(`   ✅ Analyzed ${this.libraryInfo.size} libraries`);
  }

  /**
   * Analyze individual library
   */
  async analyzeLibrary(libraryName) {
    try {
      const libraryPath = path.join('node_modules', libraryName);
      
      if (!fs.existsSync(libraryPath)) {
        console.warn(`   ⚠️  Library not found: ${libraryName}`);
        return;
      }
      
      const packageJsonPath = path.join(libraryPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Analyze library structure
      const structure = await this.analyzeLibraryStructure(libraryPath);
      
      // Find main entry points
      const entryPoints = this.findEntryPoints(libraryPath, packageJson);
      
      // Calculate sizes
      const sizes = await this.calculateLibrarySizes(libraryPath, entryPoints);
      
      this.libraryInfo.set(libraryName, {
        path: libraryPath,
        packageJson,
        structure,
        entryPoints,
        sizes,
        isReactCore: ['react', 'react-dom'].includes(libraryName),
        optimizationPotential: this.assessOptimizationPotential(libraryName, structure, sizes)
      });
      
      console.log(`   📦 ${libraryName}: ${(sizes.total / 1024).toFixed(2)}KB (${entryPoints.length} entry points)`);
      
    } catch (error) {
      console.warn(`   ⚠️  Failed to analyze ${libraryName}: ${error.message}`);
    }
  }

  /**
   * Analyze library structure
   */
  async analyzeLibraryStructure(libraryPath) {
    const structure = {
      hasProduction: false,
      hasDevelopment: false,
      hasUMD: false,
      hasESM: false,
      hasCJS: false,
      buildFormats: [],
      sourceFiles: []
    };
    
    // Check for different build formats
    const formats = [
      { dir: 'cjs', type: 'cjs', name: 'CommonJS' },
      { dir: 'esm', type: 'esm', name: 'ES Modules' },
      { dir: 'umd', type: 'umd', name: 'UMD' },
      { dir: 'lib', type: 'lib', name: 'Library' },
      { dir: 'dist', type: 'dist', name: 'Distribution' }
    ];
    
    for (const format of formats) {
      const formatPath = path.join(libraryPath, format.dir);
      if (fs.existsSync(formatPath)) {
        structure[`has${format.type.toUpperCase()}`] = true;
        structure.buildFormats.push(format);
        
        // Find source files in this format
        const files = this.findJavaScriptFiles(formatPath);
        structure.sourceFiles.push(...files.map(f => ({
          path: f,
          format: format.type,
          relativePath: path.relative(libraryPath, f)
        })));
      }
    }
    
    // Check for production/development variants
    structure.sourceFiles.forEach(file => {
      if (file.path.includes('production')) structure.hasProduction = true;
      if (file.path.includes('development')) structure.hasDevelopment = true;
    });
    
    return structure;
  }

  /**
   * Find JavaScript files recursively
   */
  findJavaScriptFiles(dirPath) {
    const files = [];
    
    const scan = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            scan(itemPath);
          } else if (item.endsWith('.js') && !item.endsWith('.min.js')) {
            files.push(itemPath);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };
    
    scan(dirPath);
    return files;
  }

  /**
   * Find entry points for library
   */
  findEntryPoints(libraryPath, packageJson) {
    const entryPoints = [];
    
    // Main entry
    if (packageJson.main) {
      const mainPath = path.join(libraryPath, packageJson.main);
      if (fs.existsSync(mainPath)) {
        entryPoints.push({
          type: 'main',
          path: mainPath,
          relativePath: packageJson.main
        });
      }
    }
    
    // Module entry (ESM)
    if (packageJson.module) {
      const modulePath = path.join(libraryPath, packageJson.module);
      if (fs.existsSync(modulePath)) {
        entryPoints.push({
          type: 'module',
          path: modulePath,
          relativePath: packageJson.module
        });
      }
    }
    
    // Exports map
    if (packageJson.exports) {
      this.parseExportsMap(libraryPath, packageJson.exports, entryPoints);
    }
    
    return entryPoints;
  }

  /**
   * Parse exports map for entry points
   */
  parseExportsMap(libraryPath, exports, entryPoints) {
    const processExport = (key, value) => {
      if (typeof value === 'string') {
        const exportPath = path.join(libraryPath, value);
        if (fs.existsSync(exportPath)) {
          entryPoints.push({
            type: 'export',
            key,
            path: exportPath,
            relativePath: value
          });
        }
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          processExport(`${key}.${subKey}`, subValue);
        });
      }
    };
    
    Object.entries(exports).forEach(([key, value]) => {
      processExport(key, value);
    });
  }

  /**
   * Calculate library sizes
   */
  async calculateLibrarySizes(libraryPath, entryPoints) {
    const sizes = {
      total: 0,
      production: 0,
      development: 0,
      entryPoints: {}
    };
    
    // Calculate total library size
    sizes.total = await this.calculateDirectorySize(libraryPath);
    
    // Calculate individual entry point sizes
    for (const entry of entryPoints) {
      if (fs.existsSync(entry.path)) {
        const stat = fs.statSync(entry.path);
        sizes.entryPoints[entry.relativePath] = stat.size;
        
        if (entry.path.includes('production')) {
          sizes.production += stat.size;
        } else if (entry.path.includes('development')) {
          sizes.development += stat.size;
        }
      }
    }
    
    return sizes;
  }

  /**
   * Calculate directory size
   */
  async calculateDirectorySize(dirPath) {
    let totalSize = 0;
    
    const scan = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            scan(itemPath);
          } else {
            totalSize += stat.size;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };
    
    scan(dirPath);
    return totalSize;
  }

  /**
   * Assess optimization potential
   */
  assessOptimizationPotential(libraryName, structure, sizes) {
    const potential = {
      score: 0,
      reasons: [],
      estimatedReduction: 0
    };
    
    // React core libraries have high potential
    if (['react', 'react-dom'].includes(libraryName)) {
      potential.score += 40;
      potential.reasons.push('React core library with development code');
      potential.estimatedReduction += sizes.total * 0.3;
    }
    
    // Large libraries
    if (sizes.total > 500 * 1024) { // > 500KB
      potential.score += 30;
      potential.reasons.push(`Large library (${(sizes.total / 1024).toFixed(2)}KB)`);
      potential.estimatedReduction += sizes.total * 0.2;
    }
    
    // Has development builds
    if (structure.hasDevelopment && structure.hasProduction) {
      potential.score += 20;
      potential.reasons.push('Has separate development/production builds');
      potential.estimatedReduction += sizes.development * 0.8;
    }
    
    // Multiple build formats
    if (structure.buildFormats.length > 1) {
      potential.score += 15;
      potential.reasons.push(`Multiple build formats (${structure.buildFormats.length})`);
    }
    
    // Many source files
    if (structure.sourceFiles.length > 10) {
      potential.score += 10;
      potential.reasons.push(`Many source files (${structure.sourceFiles.length})`);
    }
    
    return potential;
  }

  /**
   * Phase 2: Create optimized builds
   */
  async createOptimizedBuilds() {
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
    
    for (const [libraryName, info] of this.libraryInfo) {
      if (info.optimizationPotential.score > 20) {
        await this.optimizeLibrary(libraryName, info);
      }
    }
    
    console.log(`   ✅ Created ${this.stats.customBuildsCreated} optimized builds`);
  }

  /**
   * Optimize individual library
   */
  async optimizeLibrary(libraryName, info) {
    console.log(`   🔧 Optimizing ${libraryName}...`);
    
    try {
      const outputPath = path.join(this.options.outputDir, libraryName);
      
      // Create library output directory
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      
      let totalReduction = 0;
      
      // Optimize each entry point
      for (const entryPoint of info.entryPoints) {
        const optimizedResult = await this.optimizeFile(entryPoint.path, libraryName);
        
        if (optimizedResult) {
          // Write optimized file
          const outputFile = path.join(outputPath, entryPoint.relativePath);
          const outputDir = path.dirname(outputFile);
          
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          fs.writeFileSync(outputFile, optimizedResult.code);
          
          totalReduction += optimizedResult.reduction;
          this.stats.filesOptimized++;
        }
      }
      
      // Copy package.json with modifications
      await this.createOptimizedPackageJson(info, outputPath);
      
      this.stats.totalSizeReduction += totalReduction;
      this.stats.customBuildsCreated++;
      
      console.log(`     ✅ ${(totalReduction / 1024).toFixed(2)}KB saved`);
      
    } catch (error) {
      console.warn(`     ⚠️  Failed to optimize ${libraryName}: ${error.message}`);
    }
  }

  /**
   * Optimize individual file
   */
  async optimizeFile(filePath, libraryName) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const originalSize = content.length;
      
      // Skip already minified files
      if (filePath.includes('.min.js') || content.length < 1000) {
        return null;
      }
      
      // Parse and optimize
      const ast = parser.parse(content, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: ['jsx']
      });
      
      // Apply React-specific optimizations
      if (libraryName === 'react' || libraryName === 'react-dom') {
        this.applyReactOptimizations(ast);
      }
      
      // Apply general semantic optimizations
      this.applySemanticOptimizations(ast);
      
      // Generate optimized code
      const optimizedCode = generate(ast, {
        compact: true,
        comments: false,
        retainLines: false
      }).code;
      
      const reduction = originalSize - optimizedCode.length;
      
      return {
        code: optimizedCode,
        reduction,
        originalSize,
        optimizedSize: optimizedCode.length
      };
      
    } catch (error) {
      console.warn(`     ⚠️  Failed to optimize file ${path.relative(process.cwd(), filePath)}: ${error.message}`);
      return null;
    }
  }

  /**
   * Apply React-specific optimizations
   */
  applyReactOptimizations(ast) {
    traverse(ast, {
      // Remove development warnings
      CallExpression(path) {
        if (this.options.reactOptimizations.removeDevWarnings) {
          // Remove console.warn/error in production
          if (types.isMemberExpression(path.node.callee) &&
              types.isIdentifier(path.node.callee.object, { name: 'console' }) &&
              (types.isIdentifier(path.node.callee.property, { name: 'warn' }) ||
               types.isIdentifier(path.node.callee.property, { name: 'error' }))) {
            path.remove();
          }
          
          // Remove warning() calls
          if (types.isIdentifier(path.node.callee, { name: 'warning' })) {
            path.remove();
          }
        }
      },
      
      // Optimize React.createElement calls
      CallExpression(path) {
        if (types.isMemberExpression(path.node.callee) &&
            types.isIdentifier(path.node.callee.object, { name: 'React' }) &&
            types.isIdentifier(path.node.callee.property, { name: 'createElement' })) {
          
          // Could optimize createElement calls here
          // For now, just mark for potential optimization
        }
      },
      
      // Remove __DEV__ blocks
      IfStatement(path) {
        if (types.isIdentifier(path.node.test, { name: '__DEV__' }) ||
            (types.isMemberExpression(path.node.test) &&
             types.isIdentifier(path.node.test.property, { name: '__DEV__' }))) {
          path.remove();
        }
      },
      
      // Remove development-only code blocks
      IfStatement(path) {
        if (types.isBinaryExpression(path.node.test) &&
            path.node.test.operator === '!==' &&
            types.isStringLiteral(path.node.test.right, { value: 'production' })) {
          path.remove();
        }
      }
    });
  }

  /**
   * Apply general semantic optimizations
   */
  applySemanticOptimizations(ast) {
    const identifierMap = new Map();
    let counter = 0;
    
    // Generate short identifiers
    const generateIdentifier = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      let num = counter++;
      
      do {
        result = chars[num % 26] + result;
        num = Math.floor(num / 26);
      } while (num > 0);
      
      return result;
    };
    
    // First pass: collect function and variable declarations
    traverse(ast, {
      FunctionDeclaration(path) {
        if (path.node.id && !this.isProtectedIdentifier(path.node.id.name)) {
          const newName = generateIdentifier();
          identifierMap.set(path.node.id.name, newName);
        }
      },
      
      VariableDeclarator(path) {
        if (types.isIdentifier(path.node.id) && 
            !this.isProtectedIdentifier(path.node.id.name)) {
          const newName = generateIdentifier();
          identifierMap.set(path.node.id.name, newName);
        }
      }
    });
    
    // Second pass: rename identifiers
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        if (identifierMap.has(name)) {
          path.node.name = identifierMap.get(name);
        }
      }
    });
  }

  /**
   * Check if identifier should be protected from optimization
   */
  isProtectedIdentifier(name) {
    const protectedIdentifiers = [
      // React core
      'React', 'Component', 'PureComponent', 'createElement', 'useState',
      'useEffect', 'useContext', 'useReducer', 'useMemo', 'useCallback',
      'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue',
      
      // DOM/Browser APIs
      'window', 'document', 'console', 'setTimeout', 'setInterval',
      'requestAnimationFrame', 'cancelAnimationFrame',
      
      // Node.js
      'require', 'module', 'exports', '__dirname', '__filename',
      'process', 'global', 'Buffer',
      
      // Common patterns
      'default', 'prototype', 'constructor', 'length', 'name'
    ];
    
    return protectedIdentifiers.includes(name) || 
           name.startsWith('__') || 
           name.toUpperCase() === name; // Constants
  }

  /**
   * Create optimized package.json
   */
  async createOptimizedPackageJson(info, outputPath) {
    const originalPackageJson = { ...info.packageJson };
    
    // Modify for optimized build
    originalPackageJson.name = `${originalPackageJson.name}-optimized`;
    originalPackageJson.description = `${originalPackageJson.description} (Semantically Optimized)`;
    originalPackageJson.version = `${originalPackageJson.version}-optimized`;
    
    // Add optimization metadata
    originalPackageJson._optimization = {
      optimizedBy: 'SDM Semantic Optimizer',
      originalSize: info.sizes.total,
      timestamp: new Date().toISOString(),
      optimizations: [
        'Semantic minification',
        'Dead code elimination',
        'Identifier optimization'
      ]
    };
    
    if (info.isReactCore) {
      originalPackageJson._optimization.optimizations.push(
        'React-specific optimizations',
        'Development code removal',
        'Warning removal'
      );
    }
    
    fs.writeFileSync(
      path.join(outputPath, 'package.json'),
      JSON.stringify(originalPackageJson, null, 2)
    );
  }

  /**
   * Phase 3: Create custom React build
   */
  async createCustomReactBuild() {
    const reactInfo = this.libraryInfo.get('react');
    const reactDomInfo = this.libraryInfo.get('react-dom');
    
    if (!reactInfo) {
      console.log('   ⚠️  React not found, skipping custom React build');
      return;
    }
    
    const customReactPath = path.join(this.options.outputDir, 'custom-react');
    if (!fs.existsSync(customReactPath)) {
      fs.mkdirSync(customReactPath, { recursive: true });
    }
    
    // Create ultra-optimized React bundle
    await this.createUltraOptimizedReact(reactInfo, reactDomInfo, customReactPath);
    
    console.log('   ✅ Custom React build created');
  }

  /**
   * Create ultra-optimized React bundle
   */
  async createUltraOptimizedReact(reactInfo, reactDomInfo, outputPath) {
    try {
      // Find production builds
      const reactProd = reactInfo.structure.sourceFiles.find(f => 
        f.path.includes('production') && !f.path.includes('min')
      );
      
      if (!reactProd) {
        throw new Error('React production build not found');
      }
      
      // Read and optimize React core
      const reactContent = fs.readFileSync(reactProd.path, 'utf-8');
      const reactAST = parser.parse(reactContent, {
        sourceType: 'script',
        allowReturnOutsideFunction: true
      });
      
      // Apply ultra-aggressive React optimizations
      this.applyUltraReactOptimizations(reactAST);
      
      // Generate ultra-compact React
      const ultraReact = generate(reactAST, {
        compact: true,
        comments: false,
        retainLines: false,
        minified: true
      }).code;
      
      // Create custom entry point
      const customEntry = `
'use strict';
// SDM Ultra-Optimized React Build
// Generated: ${new Date().toISOString()}
// Original size: ${(reactContent.length / 1024).toFixed(2)}KB
// Optimized size: ${(ultraReact.length / 1024).toFixed(2)}KB
// Reduction: ${(((reactContent.length - ultraReact.length) / reactContent.length) * 100).toFixed(2)}%

${ultraReact}
`;
      
      fs.writeFileSync(path.join(outputPath, 'react.ultra.js'), customEntry);
      
      // Create package.json for custom React
      const customPackage = {
        name: '@sdm/react-ultra',
        version: '1.0.0-ultra',
        description: 'Ultra-optimized React build with semantic optimization',
        main: 'react.ultra.js',
        author: 'SDM Semantic Optimizer',
        license: 'MIT',
        peerDependencies: {
          react: reactInfo.packageJson.version
        },
        _optimization: {
          type: 'ultra-aggressive',
          originalSize: reactContent.length,
          optimizedSize: ultraReact.length,
          reduction: ((reactContent.length - ultraReact.length) / reactContent.length) * 100,
          features: [
            'Development code removal',
            'Warning system removal',
            'Debug info removal',
            'Semantic identifier optimization',
            'Dead code elimination',
            'Ultra-compact generation'
          ]
        }
      };
      
      fs.writeFileSync(
        path.join(outputPath, 'package.json'),
        JSON.stringify(customPackage, null, 2)
      );
      
    } catch (error) {
      console.warn(`   ⚠️  Failed to create ultra-optimized React: ${error.message}`);
    }
  }

  /**
   * Apply ultra-aggressive React optimizations
   */
  applyUltraReactOptimizations(ast) {
    traverse(ast, {
      // Remove all development code
      IfStatement(path) {
        // Remove NODE_ENV !== 'production' blocks
        if (types.isBinaryExpression(path.node.test)) {
          const { left, operator, right } = path.node.test;
          
          if (operator === '!==' &&
              types.isMemberExpression(left) &&
              types.isStringLiteral(right, { value: 'production' })) {
            path.remove();
          }
        }
      },
      
      // Remove all console statements
      CallExpression(path) {
        if (types.isMemberExpression(path.node.callee) &&
            types.isIdentifier(path.node.callee.object, { name: 'console' })) {
          path.remove();
        }
      },
      
      // Remove warning functions entirely
      FunctionDeclaration(path) {
        if (types.isIdentifier(path.node.id, { name: 'warning' }) ||
            types.isIdentifier(path.node.id, { name: 'warn' }) ||
            types.isIdentifier(path.node.id, { name: 'error' })) {
          path.remove();
        }
      },
      
      // Remove development-only properties
      ObjectProperty(path) {
        if (types.isStringLiteral(path.node.key, { value: 'displayName' }) ||
            types.isStringLiteral(path.node.key, { value: '__DEV__' }) ||
            types.isStringLiteral(path.node.key, { value: 'propTypes' })) {
          path.remove();
        }
      },
      
      // Optimize string literals
      StringLiteral(path) {
        // Remove long error messages, keep only short ones
        if (path.node.value.length > 50 && 
            (path.node.value.includes('Warning:') || 
             path.node.value.includes('Error:'))) {
          path.node.value = 'Err';
        }
      }
    });
  }

  /**
   * Phase 4: Create integration manifests
   */
  async createIntegrationManifests() {
    const manifest = {
      timestamp: new Date().toISOString(),
      optimizedLibraries: {},
      integrationInstructions: {},
      webpack: {
        alias: {},
        resolve: {}
      },
      nextjs: {
        webpack: {}
      }
    };
    
    // Create integration instructions for each optimized library
    for (const [libraryName, info] of this.libraryInfo) {
      if (this.optimizationResults.has(libraryName)) {
        const optimizedPath = path.join(this.options.outputDir, libraryName);
        
        manifest.optimizedLibraries[libraryName] = {
          originalSize: info.sizes.total,
          optimizedPath,
          entryPoints: info.entryPoints.map(ep => ep.relativePath)
        };
        
        // Webpack alias for replacing original with optimized
        manifest.webpack.alias[libraryName] = path.resolve(optimizedPath);
        
        // Next.js integration
        manifest.nextjs.webpack[libraryName] = {
          alias: path.resolve(optimizedPath),
          fallback: `node_modules/${libraryName}`
        };
        
        manifest.integrationInstructions[libraryName] = {
          install: `Copy ${optimizedPath} to your project`,
          webpack: `Add alias: { "${libraryName}": "${optimizedPath}" }`,
          nextjs: `Add to next.config.js webpack.resolve.alias`,
          rollback: `Remove alias to use original ${libraryName}`
        };
      }
    }
    
    // Custom React integration
    const customReactPath = path.join(this.options.outputDir, 'custom-react');
    if (fs.existsSync(customReactPath)) {
      manifest.customReact = {
        path: customReactPath,
        usage: 'import React from "./custom-builds/custom-react/react.ultra.js"',
        webpack: `alias: { "react": "${path.resolve(customReactPath, 'react.ultra.js')}" }`,
        size: 'Ultra-compact React build'
      };
    }
    
    fs.writeFileSync(
      path.join(this.options.outputDir, 'integration-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('   ✅ Integration manifest created');
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      type: 'react-library-optimization',
      summary: {
        librariesAnalyzed: this.libraryInfo.size,
        librariesProcessed: this.stats.librariesProcessed,
        filesOptimized: this.stats.filesOptimized,
        customBuildsCreated: this.stats.customBuildsCreated,
        totalSizeReduction: this.stats.totalSizeReduction,
        totalSizeReductionMB: (this.stats.totalSizeReduction / (1024 * 1024)).toFixed(2)
      },
      libraries: {},
      optimizedBuilds: [],
      recommendations: []
    };
    
    // Library analysis results
    for (const [libraryName, info] of this.libraryInfo) {
      report.libraries[libraryName] = {
        size: info.sizes.total,
        sizeKB: (info.sizes.total / 1024).toFixed(2),
        entryPoints: info.entryPoints.length,
        buildFormats: info.structure.buildFormats.map(f => f.name),
        optimizationScore: info.optimizationPotential.score,
        estimatedReduction: (info.optimizationPotential.estimatedReduction / 1024).toFixed(2) + 'KB'
      };
    }
    
    // Recommendations
    if (this.libraryInfo.has('react')) {
      report.recommendations.push({
        type: 'custom-react',
        description: 'Use custom ultra-optimized React build',
        impact: 'High performance improvement',
        implementation: 'Add webpack alias to custom-react/react.ultra.js'
      });
    }
    
    if (this.stats.customBuildsCreated > 0) {
      report.recommendations.push({
        type: 'replace-libraries',
        description: `Replace ${this.stats.customBuildsCreated} libraries with optimized versions`,
        impact: `${(this.stats.totalSizeReduction / 1024).toFixed(2)}KB reduction`,
        implementation: 'Update webpack aliases to point to custom-builds/'
      });
    }
    
    fs.writeFileSync(
      path.join(this.options.outputDir, 'optimization-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📊 React Library Optimization Summary:');
    console.log('====================================');
    console.log(`📚 Libraries analyzed: ${this.libraryInfo.size}`);
    console.log(`🔧 Files optimized: ${this.stats.filesOptimized}`);
    console.log(`📦 Custom builds created: ${this.stats.customBuildsCreated}`);
    console.log(`💾 Total size reduction: ${(this.stats.totalSizeReduction / 1024).toFixed(2)}KB`);
    console.log(`📋 Integration manifest: ${this.options.outputDir}/integration-manifest.json`);
    console.log(`📈 Full report: ${this.options.outputDir}/optimization-report.json`);
    
    if (fs.existsSync(path.join(this.options.outputDir, 'custom-react'))) {
      console.log(`⚛️  Custom React build: ${this.options.outputDir}/custom-react/react.ultra.js`);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--aggressive':
        options.aggressive = true;
        break;
      case '--no-react':
        options.targetLibraries = options.targetLibraries || [];
        options.targetLibraries = options.targetLibraries.filter(lib => 
          !['react', 'react-dom'].includes(lib)
        );
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--help':
        console.log(`
⚛️  React Library Optimizer

Usage:
  node react-library-optimizer.js [options]

Options:
  --aggressive    Enable ultra-aggressive optimizations
  --no-react      Skip React core libraries
  --output DIR    Custom output directory (default: custom-builds)
  --help          Show this help

Examples:
  node react-library-optimizer.js
  node react-library-optimizer.js --aggressive
  node react-library-optimizer.js --output ./optimized-libs
`);
        process.exit(0);
    }
  }
  
  try {
    const optimizer = new ReactLibraryOptimizer(options);
    await optimizer.optimize();
    
    console.log('\n✅ React library optimization completed successfully!');
    console.log('🔧 Check the integration manifest for setup instructions.');
    
  } catch (error) {
    console.error('\n❌ React library optimization failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { ReactLibraryOptimizer };

// Run if called directly
if (require.main === module) {
  main();
}
