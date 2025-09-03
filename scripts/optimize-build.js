#!/usr/bin/env node

/**
 * Post-Build Optimization Script for SDM
 * 
 * This script runs after Next.js build to optimize bundles using semantic optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting SDM Bundle Optimization...');
console.log('=====================================\n');

// Paths
const nextBuildDir = '.next/static/chunks';
const optimizerDir = './optimized-build-system';
const tempBuildDir = 'build/static/js';

try {
  // 1. Check if Next.js build exists
  if (!fs.existsSync(nextBuildDir)) {
    throw new Error('Next.js build not found. Please run "npm run build" first.');
  }

  // 2. Create temp build structure for optimizer
  console.log('📁 Setting up optimization environment...');
  if (!fs.existsSync('build/static')) {
    fs.mkdirSync('build/static', { recursive: true });
  }
  if (!fs.existsSync(tempBuildDir)) {
    fs.mkdirSync(tempBuildDir, { recursive: true });
  }

  // 3. Find and copy main bundles
  const chunkFiles = fs.readdirSync(nextBuildDir);
  const mainBundles = chunkFiles.filter(file => 
    (file.startsWith('main-') || file.includes('main-app') || file.startsWith('fd9d1056-') || 
     file.startsWith('framework-') || file.startsWith('23-') || file.startsWith('178-') ||
     file.startsWith('polyfills-') || file.startsWith('vendors-')) && 
    file.endsWith('.js')
  );

  console.log(`📦 Found ${mainBundles.length} main bundles to optimize:`);
  mainBundles.forEach(bundle => console.log(`   - ${bundle}`));

  // Copy largest bundles for optimization
  const bundlesToOptimize = [];
  for (const bundle of mainBundles) {
    const sourcePath = path.join(nextBuildDir, bundle);
    const stats = fs.statSync(sourcePath);
    
    // Only optimize bundles larger than 50KB
    if (stats.size > 50 * 1024) {
      let targetName;
      if (bundle.startsWith('main-')) {
        targetName = 'main.js';
      } else if (bundle.includes('main-app')) {
        targetName = 'main-app.js';
      } else {
        targetName = bundle; // Keep original name for other chunks
      }
      const targetPath = path.join(tempBuildDir, targetName);
      
      fs.copyFileSync(sourcePath, targetPath);
      bundlesToOptimize.push({
        original: bundle,
        target: targetName,
        size: stats.size
      });
      
      console.log(`   ✅ Copied ${bundle} (${(stats.size/1024).toFixed(2)}KB) → ${targetName}`);
    }
  }

  if (bundlesToOptimize.length === 0) {
    console.log('⚠️  No bundles large enough to optimize (>50KB)');
    process.exit(0);
  }

  // 4. Create main-bundle.js for the optimizer (it expects this specific naming pattern)
  if (bundlesToOptimize.length > 0) {
    // Find the largest bundle to use as the main bundle
    const largestBundle = bundlesToOptimize.reduce((prev, current) => 
      (prev.size > current.size) ? prev : current
    );
    
    const mainBundlePath = path.join(tempBuildDir, 'main-bundle.js');
    const sourcePath = path.join(tempBuildDir, largestBundle.target);
    
    // Copy the largest bundle as main-bundle.js for the optimizer
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, mainBundlePath);
      console.log(`🎯 Created main-bundle.js from ${largestBundle.target} for optimization`);
    }
  }

  // 5. Run universal semantic optimization (JS + CSS + HTML)
  console.log('\n🔧 Running universal semantic optimization...');
  
  const optimizerPath = path.resolve(optimizerDir);
  const buildPath = path.resolve(tempBuildDir);
  const nextBuildPath = path.resolve('.next');
  
  try {
    // First optimize JavaScript bundles (existing)
    console.log('📦 Optimizing JavaScript bundles...');
    execSync(
      `cd "${optimizerPath}" && node scripts/universal-optimizer.js --build-dir "${buildPath}" --strategy max-aggression`,
      { stdio: 'inherit' }
    );
    
    // Then optimize CSS and HTML files
    console.log('🎨 Optimizing CSS and HTML files...');
    execSync(
      `cd "${optimizerPath}" && node scripts/universal-semantic-optimizer.js "${nextBuildPath}" --extensions .css,.html`,
      { stdio: 'inherit' }
    );
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }

  // 5. Copy optimized files back to Next.js build and process CSS/HTML
  console.log('\n📋 Processing optimized files...');
  
  let totalSavings = 0;
  let cssHtmlSavings = 0;
  const optimizedFiles = [];
  
  // Check for CSS/HTML optimization results
  const universalManifestPath = path.join('.next', 'universal-optimization-manifest.json');
  if (fs.existsSync(universalManifestPath)) {
    const universalManifest = JSON.parse(fs.readFileSync(universalManifestPath, 'utf-8'));
    cssHtmlSavings = universalManifest.stats.sizeReduction;
    
    console.log(`🎨 CSS/HTML optimization results:`);
    console.log(`   - Files processed: ${universalManifest.stats.totalFiles}`);
    console.log(`   - Total optimizations: ${universalManifest.stats.totalOptimizations}`);
    console.log(`   - Size reduction: ${(cssHtmlSavings / 1024).toFixed(2)}KB`);
  }
  
  for (const bundle of bundlesToOptimize) {
    const optimizedFile = path.join(tempBuildDir, bundle.target.replace('.js', '.max-aggression.js'));
    
    if (fs.existsSync(optimizedFile)) {
      const originalPath = path.join(nextBuildDir, bundle.original);
      const originalSize = fs.statSync(originalPath).size;
      const optimizedSize = fs.statSync(optimizedFile).size;
      const savings = originalSize - optimizedSize;
      
      // Backup original
      fs.copyFileSync(originalPath, originalPath + '.backup');
      
      // Replace with optimized version
      fs.copyFileSync(optimizedFile, originalPath);
      
      totalSavings += savings;
      optimizedFiles.push({
        name: bundle.original,
        originalSize: originalSize,
        optimizedSize: optimizedSize,
        savings: savings,
        percentage: ((savings / originalSize) * 100).toFixed(2)
      });
      
      console.log(`   ✅ ${bundle.original}: ${(originalSize/1024).toFixed(2)}KB → ${(optimizedSize/1024).toFixed(2)}KB (${((savings/originalSize)*100).toFixed(2)}% saved)`);
    }
  }

  // 6. Generate comprehensive optimization report
  const report = {
    timestamp: new Date().toISOString(),
    optimization: {
      javascript: {
        files: optimizedFiles.length,
        savings: totalSavings,
        savingsKB: (totalSavings / 1024).toFixed(2)
      },
      cssHtml: {
        savings: cssHtmlSavings,
        savingsKB: (cssHtmlSavings / 1024).toFixed(2)
      },
      total: {
        savings: totalSavings + cssHtmlSavings,
        savingsKB: ((totalSavings + cssHtmlSavings) / 1024).toFixed(2)
      }
    },
    files: optimizedFiles
  };

  fs.writeFileSync('optimization-report.json', JSON.stringify(report, null, 2));

  // 7. Cleanup temp files
  console.log('\n🧹 Cleaning up temporary files...');
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true });
  }

  // 8. Comprehensive success summary
  console.log('\n🎉 Universal Optimization Complete!');
  console.log('==================================');
  console.log(`📦 JavaScript files optimized: ${optimizedFiles.length}`);
  console.log(`🎨 CSS/HTML files processed: ${cssHtmlSavings > 0 ? 'Yes' : 'No'}`);
  console.log(`💾 JavaScript savings: ${(totalSavings/1024).toFixed(2)}KB`);
  if (cssHtmlSavings > 0) {
    console.log(`💾 CSS/HTML savings: ${(cssHtmlSavings/1024).toFixed(2)}KB`);
  }
  console.log(`💾 Total savings: ${((totalSavings + cssHtmlSavings)/1024).toFixed(2)}KB`);
  
  if (optimizedFiles.length > 0) {
    console.log(`📊 Average JS reduction: ${(optimizedFiles.reduce((acc, f) => acc + parseFloat(f.percentage), 0) / optimizedFiles.length).toFixed(2)}%`);
  }
  
  console.log(`📋 Report saved: optimization-report.json`);
  console.log(`🔄 Backups created with .backup extension`);
  
  console.log('\n✅ Your Next.js app is now fully optimized (JS + CSS + HTML) and ready for deployment!');

} catch (error) {
  console.error('\n❌ Optimization failed:', error.message);
  process.exit(1);
}

