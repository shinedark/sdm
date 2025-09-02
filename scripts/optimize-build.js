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
const optimizerDir = '../optimized-build-system';
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
    (file.startsWith('main-') || file.includes('main-app') || file.startsWith('fd9d1056-')) && 
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
      const targetName = bundle.startsWith('main-') ? 'main.js' : `${bundle.replace('.js', '')}.js`;
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

  // 4. Run semantic optimization
  console.log('\n🔧 Running semantic optimization...');
  
  const optimizerPath = path.resolve(optimizerDir);
  const buildPath = path.resolve(tempBuildDir);
  
  try {
    execSync(
      `cd "${optimizerPath}" && node scripts/universal-optimizer.js --build-dir "${buildPath}" --strategy max-aggression`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }

  // 5. Copy optimized files back to Next.js build
  console.log('\n📋 Copying optimized bundles back to Next.js build...');
  
  let totalSavings = 0;
  const optimizedFiles = [];
  
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

  // 6. Generate optimization report
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: optimizedFiles.length,
    totalSavings: totalSavings,
    totalSavingsKB: (totalSavings / 1024).toFixed(2),
    files: optimizedFiles
  };

  fs.writeFileSync('optimization-report.json', JSON.stringify(report, null, 2));

  // 7. Cleanup temp files
  console.log('\n🧹 Cleaning up temporary files...');
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true });
  }

  // 8. Success summary
  console.log('\n🎉 Optimization Complete!');
  console.log('========================');
  console.log(`📁 Files optimized: ${optimizedFiles.length}`);
  console.log(`💾 Total savings: ${(totalSavings/1024).toFixed(2)}KB`);
  console.log(`📊 Average reduction: ${(optimizedFiles.reduce((acc, f) => acc + parseFloat(f.percentage), 0) / optimizedFiles.length).toFixed(2)}%`);
  console.log(`📋 Report saved: optimization-report.json`);
  console.log(`🔄 Backups created with .backup extension`);
  
  console.log('\n✅ Your Next.js app is now optimized and ready for deployment!');

} catch (error) {
  console.error('\n❌ Optimization failed:', error.message);
  process.exit(1);
}

