#!/usr/bin/env node

/**
 * Node Modules Analyzer & Optimizer
 * 
 * Analyzes your node_modules to:
 * - Find unused dependencies
 * - Identify optimization opportunities
 * - Create optimized versions of heavy packages
 * - Generate bundle analysis reports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NodeModulesAnalyzer {
  constructor(options = {}) {
    this.options = {
      projectRoot: options.projectRoot || process.cwd(),
      analyzeUsage: options.analyzeUsage !== false,
      optimizePackages: options.optimizePackages || true,
      generateReport: options.generateReport !== false,
      
      // Packages that are safe to optimize
      optimizablePackages: options.optimizablePackages || [
        '@rainbow-me/rainbowkit',
        '@react-three/fiber', 
        '@react-three/drei',
        'three',
        'ethers',
        '@fortawesome/react-fontawesome',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/free-brands-svg-icons'
      ],
      
      // Packages to exclude from analysis
      excludePackages: options.excludePackages || [
        'react',
        'react-dom',
        'next',
        '@types/*',
        'typescript',
        'eslint*'
      ]
    };
    
    this.packageInfo = new Map();
    this.usageAnalysis = new Map();
    this.optimizationResults = new Map();
    
    this.stats = {
      totalPackages: 0,
      unusedPackages: 0,
      optimizablePackages: 0,
      totalSizeReduction: 0,
      packagesOptimized: 0
    };
  }

  /**
   * Main analysis pipeline
   */
  async analyze() {
    console.log('📦 Node Modules Analysis Starting...');
    console.log('====================================\n');
    
    try {
      // Phase 1: Discover installed packages
      console.log('📊 Phase 1: Discovering installed packages...');
      await this.discoverPackages();
      
      // Phase 2: Analyze usage patterns
      if (this.options.analyzeUsage) {
        console.log('🔍 Phase 2: Analyzing package usage...');
        await this.analyzeUsage();
      }
      
      // Phase 3: Identify optimization opportunities
      console.log('⚡ Phase 3: Identifying optimization opportunities...');
      await this.identifyOptimizations();
      
      // Phase 4: Optimize packages
      if (this.options.optimizePackages) {
        console.log('🛠️  Phase 4: Optimizing packages...');
        await this.optimizePackages();
      }
      
      // Phase 5: Generate report
      if (this.options.generateReport) {
        console.log('📋 Phase 5: Generating analysis report...');
        await this.generateReport();
      }
      
      console.log('\n🎉 Node Modules Analysis Complete!');
      return this.stats;
      
    } catch (error) {
      console.error('❌ Node modules analysis failed:', error.message);
      throw error;
    }
  }

  /**
   * Phase 1: Discover all installed packages
   */
  async discoverPackages() {
    const packageJsonPath = path.join(this.options.projectRoot, 'package.json');
    const nodeModulesPath = path.join(this.options.projectRoot, 'node_modules');
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const declaredDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    this.stats.totalPackages = Object.keys(declaredDeps).length;
    console.log(`   📋 Found ${this.stats.totalPackages} declared dependencies`);
    
    // Analyze each package
    for (const [packageName, version] of Object.entries(declaredDeps)) {
      if (this.shouldSkipPackage(packageName)) continue;
      
      await this.analyzePackage(packageName, version, nodeModulesPath);
    }
    
    console.log(`   ✅ Analyzed ${this.packageInfo.size} packages`);
  }

  /**
   * Check if package should be skipped
   */
  shouldSkipPackage(packageName) {
    return this.options.excludePackages.some(pattern => {
      if (pattern.endsWith('*')) {
        return packageName.startsWith(pattern.slice(0, -1));
      }
      return packageName === pattern;
    });
  }

  /**
   * Analyze individual package
   */
  async analyzePackage(packageName, version, nodeModulesPath) {
    try {
      const packagePath = path.join(nodeModulesPath, packageName);
      
      if (!fs.existsSync(packagePath)) {
        console.warn(`   ⚠️  Package not found: ${packageName}`);
        return;
      }
      
      const packageJsonPath = path.join(packagePath, 'package.json');
      let packageJson = {};
      
      if (fs.existsSync(packageJsonPath)) {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      }
      
      // Calculate package size
      const size = await this.calculatePackageSize(packagePath);
      
      // Analyze package structure
      const structure = await this.analyzePackageStructure(packagePath);
      
      this.packageInfo.set(packageName, {
        version,
        declaredVersion: version,
        actualVersion: packageJson.version || 'unknown',
        size,
        sizeKB: (size / 1024).toFixed(2),
        sizeMB: (size / (1024 * 1024)).toFixed(2),
        structure,
        packageJson,
        path: packagePath,
        isOptimizable: this.options.optimizablePackages.includes(packageName),
        hasTypes: fs.existsSync(path.join(packagePath, 'index.d.ts')) || 
                  fs.existsSync(path.join(packagePath, 'types')),
        mainEntry: packageJson.main || 'index.js',
        moduleEntry: packageJson.module,
        exports: packageJson.exports
      });
      
    } catch (error) {
      console.warn(`   ⚠️  Failed to analyze ${packageName}: ${error.message}`);
    }
  }

  /**
   * Calculate total size of package directory
   */
  async calculatePackageSize(packagePath) {
    let totalSize = 0;
    
    const calculateDir = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            // Skip some directories that aren't needed in production
            if (['test', 'tests', '__tests__', 'docs', 'examples', '.git'].includes(item)) {
              continue;
            }
            calculateDir(itemPath);
          } else {
            totalSize += stat.size;
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };
    
    calculateDir(packagePath);
    return totalSize;
  }

  /**
   * Analyze package structure
   */
  async analyzePackageStructure(packagePath) {
    const structure = {
      hasSourceMaps: false,
      hasTypeDefinitions: false,
      hasTests: false,
      hasDocs: false,
      fileTypes: new Map(),
      totalFiles: 0
    };
    
    const analyzeDir = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            if (['test', 'tests', '__tests__'].includes(item)) {
              structure.hasTests = true;
            } else if (['docs', 'doc', 'documentation'].includes(item)) {
              structure.hasDocs = true;
            } else if (['types', 'typings'].includes(item)) {
              structure.hasTypeDefinitions = true;
            }
            analyzeDir(itemPath);
          } else {
            structure.totalFiles++;
            const ext = path.extname(item);
            
            if (item.endsWith('.map')) {
              structure.hasSourceMaps = true;
            } else if (ext === '.d.ts') {
              structure.hasTypeDefinitions = true;
            }
            
            const count = structure.fileTypes.get(ext) || 0;
            structure.fileTypes.set(ext, count + 1);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };
    
    analyzeDir(packagePath);
    return structure;
  }

  /**
   * Phase 2: Analyze usage patterns in source code
   */
  async analyzeUsage() {
    const sourceFiles = await this.findSourceFiles();
    
    console.log(`   📁 Scanning ${sourceFiles.length} source files...`);
    
    // Initialize usage tracking
    for (const packageName of this.packageInfo.keys()) {
      this.usageAnalysis.set(packageName, {
        isImported: false,
        importCount: 0,
        importedMembers: new Set(),
        usageLocations: []
      });
    }
    
    // Scan source files for imports
    for (const filePath of sourceFiles) {
      await this.scanFileForImports(filePath);
    }
    
    // Identify unused packages
    let unusedCount = 0;
    for (const [packageName, usage] of this.usageAnalysis) {
      if (!usage.isImported) {
        unusedCount++;
        console.log(`   🗑️  Unused package: ${packageName}`);
      }
    }
    
    this.stats.unusedPackages = unusedCount;
    console.log(`   📊 Found ${unusedCount} unused packages`);
  }

  /**
   * Find all source files in the project
   */
  async findSourceFiles() {
    const { glob } = require('glob');
    
    const patterns = [
      'app/**/*.{js,jsx,ts,tsx}',
      'src/**/*.{js,jsx,ts,tsx}',
      'components/**/*.{js,jsx,ts,tsx}',
      'pages/**/*.{js,jsx,ts,tsx}',
      '*.{js,jsx,ts,tsx}'
    ];
    
    const files = [];
    for (const pattern of patterns) {
      try {
        const matches = await glob(pattern, { cwd: this.options.projectRoot });
        files.push(...matches.map(f => path.join(this.options.projectRoot, f)));
      } catch (error) {
        // Pattern might not exist
      }
    }
    
    return files;
  }

  /**
   * Scan individual file for package imports
   */
  async scanFileForImports(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Simple regex-based import detection (faster than AST parsing)
      const importRegex = /(?:import|require)\s*\(?[\s\S]*?from\s+['"`]([^'"`]+)['"`]|require\s*\(\s*['"`]([^'"`]+)['"`]\)/g;
      
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        
        // Extract package name (handle scoped packages)
        let packageName;
        if (importPath.startsWith('@')) {
          const parts = importPath.split('/');
          packageName = parts.slice(0, 2).join('/');
        } else {
          packageName = importPath.split('/')[0];
        }
        
        const usage = this.usageAnalysis.get(packageName);
        if (usage) {
          usage.isImported = true;
          usage.importCount++;
          usage.usageLocations.push({
            file: path.relative(this.options.projectRoot, filePath),
            importPath
          });
          
          // Extract imported members for more detailed analysis
          const memberMatch = content.match(new RegExp(`import\\s*{([^}]+)}\\s*from\\s*['"\`]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`));
          if (memberMatch) {
            const members = memberMatch[1].split(',').map(m => m.trim());
            members.forEach(member => usage.importedMembers.add(member));
          }
        }
      }
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  /**
   * Phase 3: Identify optimization opportunities
   */
  async identifyOptimizations() {
    let optimizableCount = 0;
    
    for (const [packageName, info] of this.packageInfo) {
      const opportunities = [];
      
      // Check if package is large and optimizable
      if (info.size > 100 * 1024) { // > 100KB
        opportunities.push({
          type: 'large-package',
          description: `Large package (${info.sizeKB}KB)`,
          potential: 'High'
        });
      }
      
      // Check for source maps that can be removed
      if (info.structure.hasSourceMaps) {
        opportunities.push({
          type: 'source-maps',
          description: 'Contains source maps (can be removed)',
          potential: 'Medium'
        });
      }
      
      // Check for test files
      if (info.structure.hasTests) {
        opportunities.push({
          type: 'test-files',
          description: 'Contains test files (can be removed)',
          potential: 'Low'
        });
      }
      
      // Check for documentation
      if (info.structure.hasDocs) {
        opportunities.push({
          type: 'documentation',
          description: 'Contains documentation (can be removed)',
          potential: 'Low'
        });
      }
      
      // Check if package has tree-shaking opportunities
      const usage = this.usageAnalysis.get(packageName);
      if (usage && usage.importedMembers.size > 0) {
        opportunities.push({
          type: 'tree-shaking',
          description: `Only ${usage.importedMembers.size} members imported`,
          potential: 'High'
        });
      }
      
      if (opportunities.length > 0) {
        this.optimizationResults.set(packageName, {
          info,
          opportunities,
          usage: usage || { isImported: false }
        });
        optimizableCount++;
        
        console.log(`   ⚡ ${packageName} (${info.sizeKB}KB): ${opportunities.length} optimization opportunities`);
      }
    }
    
    this.stats.optimizablePackages = optimizableCount;
    console.log(`   📊 Found ${optimizableCount} packages with optimization opportunities`);
  }

  /**
   * Phase 4: Optimize packages
   */
  async optimizePackages() {
    let optimizedCount = 0;
    
    for (const [packageName, analysis] of this.optimizationResults) {
      if (!analysis.info.isOptimizable) continue;
      
      console.log(`   🛠️  Optimizing ${packageName}...`);
      
      try {
        const originalSize = analysis.info.size;
        let optimizedSize = originalSize;
        
        // Create optimized version
        const optimizedPath = path.join(analysis.info.path, '..', `${packageName.replace('/', '-')}-optimized`);
        
        // Copy package but exclude unnecessary files
        await this.createOptimizedPackage(analysis.info.path, optimizedPath, analysis.opportunities);
        
        // Calculate new size
        if (fs.existsSync(optimizedPath)) {
          optimizedSize = await this.calculatePackageSize(optimizedPath);
          const reduction = originalSize - optimizedSize;
          
          if (reduction > 0) {
            this.stats.totalSizeReduction += reduction;
            this.stats.packagesOptimized++;
            optimizedCount++;
            
            const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);
            console.log(`     ✅ Reduced by ${(reduction / 1024).toFixed(2)}KB (${reductionPercent}%)`);
          }
        }
        
      } catch (error) {
        console.warn(`     ⚠️  Failed to optimize ${packageName}: ${error.message}`);
      }
    }
    
    console.log(`   📊 Successfully optimized ${optimizedCount} packages`);
  }

  /**
   * Create optimized version of package
   */
  async createOptimizedPackage(sourcePath, targetPath, opportunities) {
    // Create target directory
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true });
    }
    fs.mkdirSync(targetPath, { recursive: true });
    
    // Copy files selectively
    const copyDir = (src, dest) => {
      const items = fs.readdirSync(src);
      
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          // Skip directories based on optimization opportunities
          const skipDirs = ['test', 'tests', '__tests__', 'docs', 'doc'];
          if (opportunities.some(o => o.type === 'test-files') && skipDirs.includes(item)) {
            continue;
          }
          if (opportunities.some(o => o.type === 'documentation') && ['docs', 'doc', 'documentation'].includes(item)) {
            continue;
          }
          
          fs.mkdirSync(destPath, { recursive: true });
          copyDir(srcPath, destPath);
        } else {
          // Skip files based on optimization opportunities
          if (opportunities.some(o => o.type === 'source-maps') && item.endsWith('.map')) {
            continue;
          }
          
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyDir(sourcePath, targetPath);
  }

  /**
   * Phase 5: Generate comprehensive report
   */
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      type: 'node-modules-analysis',
      summary: {
        totalPackages: this.stats.totalPackages,
        unusedPackages: this.stats.unusedPackages,
        optimizablePackages: this.stats.optimizablePackages,
        packagesOptimized: this.stats.packagesOptimized,
        totalSizeReduction: this.stats.totalSizeReduction,
        totalSizeReductionMB: (this.stats.totalSizeReduction / (1024 * 1024)).toFixed(2)
      },
      packages: {},
      unusedPackages: [],
      optimizationOpportunities: {},
      recommendations: []
    };
    
    // Package details
    for (const [packageName, info] of this.packageInfo) {
      report.packages[packageName] = {
        version: info.actualVersion,
        sizeKB: info.sizeKB,
        sizeMB: info.sizeMB,
        structure: {
          totalFiles: info.structure.totalFiles,
          hasSourceMaps: info.structure.hasSourceMaps,
          hasTests: info.structure.hasTests,
          hasDocs: info.structure.hasDocs
        }
      };
    }
    
    // Unused packages
    for (const [packageName, usage] of this.usageAnalysis) {
      if (!usage.isImported) {
        report.unusedPackages.push(packageName);
      }
    }
    
    // Optimization opportunities
    for (const [packageName, analysis] of this.optimizationResults) {
      report.optimizationOpportunities[packageName] = {
        currentSizeKB: analysis.info.sizeKB,
        opportunities: analysis.opportunities,
        usage: {
          importCount: analysis.usage.importCount,
          importedMembers: Array.from(analysis.usage.importedMembers || [])
        }
      };
    }
    
    // Generate recommendations
    if (report.unusedPackages.length > 0) {
      report.recommendations.push({
        type: 'remove-unused',
        description: `Remove ${report.unusedPackages.length} unused packages`,
        command: `npm uninstall ${report.unusedPackages.join(' ')}`,
        impact: 'High'
      });
    }
    
    if (this.stats.optimizablePackages > 0) {
      report.recommendations.push({
        type: 'optimize-packages',
        description: `Optimize ${this.stats.optimizablePackages} packages`,
        impact: 'Medium'
      });
    }
    
    // Save report
    const reportPath = path.join(this.options.projectRoot, 'node-modules-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Node Modules Analysis Summary:');
    console.log('=================================');
    console.log(`📦 Total packages: ${this.stats.totalPackages}`);
    console.log(`🗑️  Unused packages: ${this.stats.unusedPackages}`);
    console.log(`⚡ Optimizable packages: ${this.stats.optimizablePackages}`);
    console.log(`🛠️  Packages optimized: ${this.stats.packagesOptimized}`);
    console.log(`💾 Total size reduction: ${(this.stats.totalSizeReduction / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`📋 Full report saved: node-modules-analysis.json`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.description} (${rec.impact} impact)`);
        if (rec.command) {
          console.log(`      Command: ${rec.command}`);
        }
      });
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
      case '--no-usage':
        options.analyzeUsage = false;
        break;
      case '--no-optimize':
        options.optimizePackages = false;
        break;
      case '--help':
        console.log(`
📦 Node Modules Analyzer & Optimizer

Usage:
  node node-modules-analyzer.js [options]

Options:
  --no-usage      Skip usage analysis
  --no-optimize   Skip package optimization
  --help          Show this help

Examples:
  node node-modules-analyzer.js
  node node-modules-analyzer.js --no-optimize
`);
        process.exit(0);
    }
  }
  
  try {
    const analyzer = new NodeModulesAnalyzer(options);
    await analyzer.analyze();
    
    console.log('\n✅ Node modules analysis completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Node modules analysis failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { NodeModulesAnalyzer };

// Run if called directly
if (require.main === module) {
  main();
}
