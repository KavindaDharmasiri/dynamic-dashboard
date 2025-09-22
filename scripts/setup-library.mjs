// scripts/setup-library.mjs

import fs from 'fs';
import path from 'path';

// Configuration
const sourceApp = 'src/app';
const libraryRoot = 'projects/dynamic-dashboard/src/lib/source';
const libraryName = 'dynamic-dashboard';

// Folders to copy from src/app → lib
const foldersToCopy = [
  'component/widgets',
  'sections',
  'superset',
  'model',
  'service',
  'shared'
];

// Files to copy from src/app root
const filesToCopy = [
  'app.component.ts',
  'app.component.html',
  'app.component.css'
];

console.log('🚀 Starting library setup...\n');

// 1. Ensure lib directory exists
if (!fs.existsSync(libraryRoot)) {
  fs.mkdirSync(libraryRoot, { recursive: true });
  console.log('✅ Created library root:', libraryRoot);
}

// 2. Copy folders
foldersToCopy.forEach(folder => {
  const source = path.join(sourceApp, folder);
  const target = path.join(libraryRoot, folder);

  if (fs.existsSync(source)) {
    if (fs.existsSync(target)) {
      console.log(`🗑️  Removing existing: ${target}`);
      fs.rmSync(target, { recursive: true, force: true });
    }

    console.log(`📂 Copying ${source} → ${target}`);
    fs.cpSync(source, target, { recursive: true });
  } else {
    console.warn(`⚠️  Source not found: ${source}`);
  }
});

// 3. Copy root files
filesToCopy.forEach(file => {
  const source = path.join(sourceApp, file);
  const target = path.join(libraryRoot, file);

  if (fs.existsSync(source)) {
    console.log(`📄 Copying ${file}`);
    fs.copyFileSync(source, target);
  }
});

// 4. Create/Update public-api.ts
const publicApiPath = 'projects/dynamic-dashboard/src/public-api.ts';
let exports = [];

// Auto-scan for components, services, modules
function scanForExports(dir, basePath = '') {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanForExports(fullPath, path.join(basePath, item));
    } else if (item.endsWith('.ts') && !item.includes('.spec.')) {
      const relPath = path.join(basePath, item.replace('.ts', ''));
      if (item.includes('.component.')) {
        exports.push(`export * from './lib/${relPath}'; // component`);
      } else if (item.includes('.service.')) {
        exports.push(`export * from './lib/${relPath}'; // service`);
      } else if (item.includes('.module.')) {
        exports.push(`export * from './lib/${relPath}'; // module`);
      }
    }
  });
}

scanForExports(libraryRoot);
fs.writeFileSync(publicApiPath, exports.join('\n') + '\n', 'utf8');
console.log(`✅ Updated ${publicApiPath} with ${exports.length} exports`);

// 5. Create a module (if not exists)
const modulePath = path.join(libraryRoot, 'dynamic-dashboard.module.ts');
if (!fs.existsSync(modulePath)) {
  const moduleContent = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Auto-import components (you can refine this)
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
    // Add your components here
  ],
  imports: [
    CommonModule
    // Add required modules
  ],
  exports: [
    AppComponent
    // Export reusable components
  ]
})
export class DynamicDashboardModule {}
`.trim();

  fs.writeFileSync(modulePath, moduleContent, 'utf8');
  console.log('✅ Created DynamicDashboardModule');

  // Add module export to public-api.ts
  const moduleExport = `export * from './lib/dynamic-dashboard.module'; // module`;
  fs.appendFileSync(publicApiPath, moduleExport + '\n');
}

// 6. Final message
console.log('\n✅ Copy complete!');
console.log('📦 Now build your library:');
console.log('   ng build dynamic-dashboard');
console.log('   cd dist/dynamic-dashboard && npm pack');
console.log('   npm install ./dynamic-dashboard-0.0.1.tgz --save');
