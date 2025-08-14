#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Next.js to Vite migration cleanup...');

// Files and directories to remove
const filesToRemove = [
  'next.config.ts',
  'next-env.d.ts',
  'src/app', // Remove the entire Next.js app directory
];

// Function to remove files and directories
function removeFileOrDir(filePath) {
  const fullPath = path.resolve(filePath);
  
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      console.log(`📁 Removing directory: ${filePath}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      console.log(`📄 Removing file: ${filePath}`);
      fs.unlinkSync(fullPath);
    }
    
    console.log(`✅ Removed: ${filePath}`);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

// Remove old Next.js files
console.log('\n📋 Removing Next.js specific files...');
filesToRemove.forEach(removeFileOrDir);

// Update package.json scripts if needed
console.log('\n📦 Checking package.json...');
const packageJsonPath = path.resolve('package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Verify Vite scripts are present
  const expectedScripts = {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  };
  
  let hasChanges = false;
  Object.entries(expectedScripts).forEach(([key, value]) => {
    if (packageJson.scripts[key] !== value) {
      console.log(`📝 Updating script "${key}": ${packageJson.scripts[key]} → ${value}`);
      packageJson.scripts[key] = value;
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Updated package.json scripts');
  } else {
    console.log('✅ Package.json scripts are already correct');
  }
}

// Create directories that might be needed
const dirsToEnsure = [
  'src/pages',
  'public'
];

console.log('\n📁 Ensuring required directories exist...');
dirsToEnsure.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
});

console.log('\n🎉 Migration cleanup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev');
console.log('3. Test all functionality');
console.log('4. Build for production: npm run build');

console.log('\n💡 Important notes:');
console.log('- All API routes have been converted to client-side API calls');
console.log('- Environment variables now use VITE_ prefix');
console.log('- WebSocket connections remain unchanged');
console.log('- Strapi integration preserved');