#!/usr/bin/env node

/**
 * 诊断脚本 - 检查所有模块文件是否存在
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredFiles = [
  './src/db/index.js',
  './src/db/schema.js',
  './src/routes/health.js',
  './src/routes/transform.js',
  './src/routes/history.js',
  './src/routes/sessions.js',
  './src/routes/analytics.js',
  './src/routes/presets.js',
  './src/routes/models.js',
  './src/services/transformService.js',
  './src/services/historyService.js',
  './src/utils/logger.js',
  './src/utils/errors.js',
  './src/engines/ModelEngine.js',
  './src/config/models.js',
  './server.js',
  './package.json'
];

console.log('🔍 诊断检查...\n');
console.log('工作目录:', __dirname);
console.log('\n检查文件:\n');

let allExists = true;
for (const file of requiredFiles) {
  const fullPath = join(__dirname, file);
  const exists = existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}${exists ? '' : ' - 文件不存在！'}`);
  if (!exists) {
    allExists = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allExists) {
  console.log('✅ 所有文件都存在！');
  console.log('\n如果 Render 仍然报错，请检查：');
  console.log('1. Root Directory 是否设置为 "backend"');
  console.log('2. 所有文件是否已提交到 Git');
  console.log('3. .gitignore 是否排除了必要文件');
} else {
  console.log('❌ 有文件缺失！请检查上述标记的文件。');
  process.exit(1);
}

