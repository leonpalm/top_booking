#!/usr/bin/env node

/**
 * 图片优化脚本
 * 用于优化 media/gallery/ 目录中的图片
 * 
 * 使用方法:
 *   npm run optimize-images
 *   或
 *   node scripts/optimize-images.js
 * 
 * 功能:
 * - 压缩 JPG/PNG 图片
 * - 生成 WebP 格式（可选）
 * - 调整图片尺寸（可选）
 * - 保持原始文件备份
 */

const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ 错误: 未安装 sharp 库');
  console.log('请先运行: npm install --save-dev sharp');
  process.exit(1);
}

// 配置
const config = {
  inputDir: path.join(__dirname, '../media/gallery'),
  outputDir: path.join(__dirname, '../media/gallery'),
  backupDir: path.join(__dirname, '../media/gallery/backup'),
  
  // 图片优化选项
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },
  
  png: {
    quality: 90,
    compressionLevel: 9
  },
  
  webp: {
    quality: 85,
    enabled: true // 设置为 false 禁用 WebP 生成
  },
  
  // 尺寸调整（可选）
  resize: {
    enabled: true, // 设置为 true 启用 - 针对高分辨率图片自动缩小
    maxWidth: 1920,
    maxHeight: 1440
  }
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  }
}

// 获取文件大小（格式化）
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 优化单张图片
async function optimizeImage(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const nameWithoutExt = path.basename(fileName, ext);
  
  // 只处理图片文件
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return { skipped: true, fileName };
  }
  
  try {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    
    // 创建备份
    ensureDir(config.backupDir);
    const backupPath = path.join(config.backupDir, fileName);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`  📦 备份: ${fileName}`);
    }
    
    let image = sharp(filePath);
    const metadata = await image.metadata();
    
    // 调整尺寸（如果启用）
    if (config.resize.enabled) {
      const { width, height } = metadata;
      if (width > config.resize.maxWidth || height > config.resize.maxHeight) {
        image = image.resize(config.resize.maxWidth, config.resize.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
        console.log(`  📐 调整尺寸: ${width}x${height} → 最大 ${config.resize.maxWidth}x${config.resize.maxHeight}`);
      }
    }
    
    // 优化原格式（先保存到临时文件，然后替换）
    const tempPath = filePath + '.tmp';
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg(config.jpeg)
        .toFile(tempPath);
    } else if (ext === '.png') {
      await image
        .png(config.png)
        .toFile(tempPath);
    }
    
    // 替换原文件
    fs.renameSync(tempPath, filePath);
    
    const newStats = fs.statSync(filePath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    const result = {
      fileName,
      originalSize,
      newSize,
      saved,
      savedPercent,
      skipped: false
    };
    
    // 生成 WebP（如果启用）
    if (config.webp.enabled) {
      const webpPath = path.join(config.outputDir, `${nameWithoutExt}.webp`);
      await image
        .webp(config.webp)
        .toFile(webpPath);
      
      const webpStats = fs.statSync(webpPath);
      result.webpSize = webpStats.size;
      console.log(`  🌐 生成 WebP: ${path.basename(webpPath)} (${formatBytes(webpStats.size)})`);
    }
    
    return result;
  } catch (error) {
    console.error(`  ❌ 处理失败: ${fileName}`, error.message);
    return { fileName, error: error.message, skipped: false };
  }
}

// 主函数
async function main() {
  console.log('🚀 开始优化图片...\n');
  console.log(`输入目录: ${config.inputDir}`);
  console.log(`输出目录: ${config.outputDir}`);
  console.log(`备份目录: ${config.backupDir}\n`);
  
  // 检查输入目录
  if (!fs.existsSync(config.inputDir)) {
    console.error(`❌ 错误: 目录不存在 ${config.inputDir}`);
    console.log('请先创建 media/gallery/ 目录并添加图片');
    process.exit(1);
  }
  
  // 获取所有图片文件
  const files = fs.readdirSync(config.inputDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    })
    .map(file => path.join(config.inputDir, file));
  
  if (files.length === 0) {
    console.log('⚠️  未找到图片文件');
    console.log(`请在 ${config.inputDir} 目录中添加图片文件`);
    return;
  }
  
  console.log(`找到 ${files.length} 张图片\n`);
  
  // 处理所有图片
  const results = [];
  for (const file of files) {
    console.log(`处理: ${path.basename(file)}`);
    const result = await optimizeImage(file);
    results.push(result);
    
    if (!result.skipped && !result.error) {
      console.log(`  ✓ 完成: ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (节省 ${result.savedPercent}%)\n`);
    } else if (result.skipped) {
      console.log(`  ⏭️  跳过: 不是图片文件\n`);
    }
  }
  
  // 汇总
  console.log('\n' + '='.repeat(50));
  console.log('📊 优化汇总');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => !r.skipped && !r.error);
  const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = successful.reduce((sum, r) => sum + r.newSize, 0);
  const totalSaved = totalOriginal - totalNew;
  const totalSavedPercent = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0;
  
  console.log(`处理成功: ${successful.length} 张`);
  console.log(`原始大小: ${formatBytes(totalOriginal)}`);
  console.log(`优化后: ${formatBytes(totalNew)}`);
  console.log(`节省空间: ${formatBytes(totalSaved)} (${totalSavedPercent}%)`);
  
  if (config.webp.enabled) {
    const totalWebp = successful
      .filter(r => r.webpSize)
      .reduce((sum, r) => sum + r.webpSize, 0);
    console.log(`WebP 总大小: ${formatBytes(totalWebp)}`);
  }
  
  console.log('\n✅ 优化完成！');
  console.log(`备份文件保存在: ${config.backupDir}`);
}

// 运行
main().catch(console.error);

