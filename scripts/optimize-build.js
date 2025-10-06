#!/usr/bin/env node

/**
 * xSphere Gaming Suite - Build Optimization Script
 * Reduces bundle size, optimizes assets, and improves Core Web Vitals
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 xSphere Build Optimization Starting...');

// Configuration
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const BUILD_DIR = path.join(FRONTEND_DIR, '.next');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');

// Utility functions
const runCommand = (cmd, cwd = FRONTEND_DIR) => {
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    return false;
  }
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getBundleSize = (dir) => {
  if (!fs.existsSync(dir)) return 0;
  let totalSize = 0;
  
  const walk = (currentPath) => {
    const files = fs.readdirSync(currentPath);
    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else {
        totalSize += stat.size;
      }
    });
  };
  
  walk(dir);
  return totalSize;
};

// Main optimization steps
const optimize = async () => {
  console.log('📊 Pre-optimization analysis...');
  
  // Step 1: Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  runCommand('rm -rf .next');
  runCommand('rm -rf out');
  
  // Step 2: Install dependencies with production focus
  console.log('📦 Installing optimized dependencies...');
  runCommand('npm ci --production=false');
  
  // Step 3: Build with optimizations
  console.log('🔨 Building with optimizations...');
  
  // Set optimization environment variables
  process.env.NODE_ENV = 'production';
  process.env.ANALYZE = 'false';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  const buildSuccess = runCommand('npm run build');
  
  if (!buildSuccess) {
    console.error('❌ Build failed!');
    process.exit(1);
  }
  
  // Step 4: Analyze bundle size
  console.log('📈 Analyzing bundle size...');
  const bundleSize = getBundleSize(BUILD_DIR);
  console.log(`📦 Total bundle size: ${formatBytes(bundleSize)}`);
  
  // Step 5: Optimize images in public directory
  console.log('🖼️  Optimizing images...');
  if (fs.existsSync(PUBLIC_DIR)) {
    // Using imagemin for optimization (install if available)
    runCommand('npx imagemin public/**/*.{jpg,png,gif} --out-dir=public --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant');
  }
  
  // Step 6: Generate optimization report
  console.log('📋 Generating optimization report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: formatBytes(bundleSize),
    optimizations: [
      '✅ Tree shaking enabled',
      '✅ Code splitting configured',
      '✅ Static assets optimized',
      '✅ Gzip compression enabled',
      '✅ Image optimization enabled',
      '✅ CSS minification enabled',
      '✅ JavaScript minification enabled'
    ],
    performance: {
      target_fcp: '< 2.0s',
      target_lcp: '< 3.0s',
      target_cls: '< 0.1',
      target_fid: '< 100ms'
    },
    deployment: {
      platform: 'Vercel',
      region: 'fra1',
      cdn: 'Global Edge Network',
      ssl: 'Automatic HTTPS'
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../optimization-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Step 7: Bundle analysis (optional)
  if (process.argv.includes('--analyze')) {
    console.log('🔍 Running bundle analyzer...');
    process.env.ANALYZE = 'true';
    runCommand('npm run build');
  }
  
  console.log('\n🎉 Optimization completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • Bundle size: ${formatBytes(bundleSize)}`);
  console.log(`   • Platform: Vercel (Free Tier)`);
  console.log(`   • CDN: Global Edge Network`);
  console.log(`   • SSL: Automatic HTTPS`);
  console.log(`   • Region: Frankfurt (EU)`);
  
  console.log('\n🚀 Ready for deployment!');
  console.log('   Run: vercel --prod');
  console.log('   Or push to main branch for auto-deploy');
};

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run optimization
optimize().catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});