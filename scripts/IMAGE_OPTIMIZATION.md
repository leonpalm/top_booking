# 图片优化指南

本指南说明如何优化和管理 `media/gallery/` 目录中的图片。

## 📁 目录结构

```
media/
├── gallery/              # Gallery 图片目录
│   ├── gallery-01.jpg   # 温馨客厅
│   ├── gallery-02.jpg   # 明亮空间
│   ├── gallery-03.jpg   # 户外露台
│   ├── gallery-04.jpg   # 天然材质
│   ├── gallery-05.jpg   # 阅读角落
│   ├── gallery-06.jpg   # 极简美学
│   └── backup/          # 原始文件备份（自动创建）
├── rooms/               # 房间相关图片
├── hero-image.png       # Hero 区域图片
└── intro.mp4           # 视频文件
```

## 🖼️ 图片命名规范

- 使用统一的命名格式：`gallery-XX.jpg`（XX 为序号）
- 文件名使用小写字母和连字符
- 避免使用空格和特殊字符
- 保持文件扩展名一致（.jpg 或 .png）

## 📐 推荐图片规格

### 尺寸
- **宽度**: 1920px（适合现代显示器）
- **高度**: 根据内容比例，建议 1080px - 1440px
- **宽高比**: 16:9 或 4:3（根据内容选择）

### 文件格式
- **主要格式**: JPG（适合照片）
- **备用格式**: WebP（现代浏览器，更小体积）
- **特殊需求**: PNG（需要透明背景时）

### 文件大小
- **优化前**: 通常 2-5MB
- **优化后**: 目标 < 500KB
- **WebP**: 目标 < 300KB

## 🚀 使用优化脚本

### Node.js 版本（推荐）

**安装依赖：**
```bash
npm install --save-dev sharp
```

**运行脚本：**
```bash
node scripts/optimize-images.js
```

**添加到 package.json：**
```json
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js"
  }
}
```

然后运行：
```bash
npm run optimize-images
```

### Python 版本

**安装依赖：**
```bash
pip install Pillow
```

**运行脚本：**
```bash
python3 scripts/optimize-images.py
```

## ⚙️ 脚本配置

### Node.js 配置（optimize-images.js）

```javascript
const config = {
  // JPEG 质量 (1-100)
  jpeg: {
    quality: 85,        // 推荐 80-90
    progressive: true,  // 渐进式加载
    mozjpeg: true       // 使用 mozjpeg 编码器
  },
  
  // PNG 质量
  png: {
    quality: 90,
    compressionLevel: 9
  },
  
  // WebP 生成
  webp: {
    quality: 85,
    enabled: true        // 设置为 false 禁用
  },
  
  // 尺寸调整
  resize: {
    enabled: false,      // 设置为 true 启用
    maxWidth: 1920,
    maxHeight: 1080
  }
};
```

### Python 配置（optimize-images.py）

```python
CONFIG = {
    'jpeg': {
        'quality': 85,
        'optimize': True,
        'progressive': True
    },
    'png': {
        'optimize': True,
        'compress_level': 9
    },
    'webp': {
        'quality': 85,
        'enabled': True
    },
    'resize': {
        'enabled': False,
        'max_width': 1920,
        'max_height': 1080
    },
    # 水印设置（可选）
    'watermark': {
        'enabled': False,  # 设置为 True 启用水印
        'text': '听海之音民宿',  # 水印文字内容
        'font_size': 36,  # 字体大小
        'color': (255, 255, 255),  # 水印颜色 (RGB)
        'opacity': 0.5,  # 透明度 (0-1)
        'position': 'bottom-right',  # 水印位置: bottom-right, bottom-left, top-right, top-left
        'margin': 20  # 距离边缘的边距
    }
}
```

## 📋 优化流程

1. **准备原始图片**
   - 将原始图片放入 `media/gallery/` 目录
   - 确保文件名符合命名规范

2. **配置优化参数**
   - 打开 `scripts/optimize-images.py`（或 `.js`）
   - 根据需要调整图片质量、尺寸和水印设置

3. **运行优化脚本**
   ```bash
   npm run optimize-images
   # 或
   python3 scripts/optimize-images.py
   ```

4. **检查结果**
   - 脚本会自动创建备份（`media/gallery/backup/`）
   - 原文件会被优化后的版本替换
   - 如果启用 WebP，会生成 `.webp` 文件
   - 如果启用水印，图片会自动添加水印

5. **验证效果**
   - 检查文件大小是否减小
   - 在浏览器中查看图片质量
   - 检查水印效果是否符合预期
   - 如有需要，调整参数重新优化

## 🔄 工作流程建议

### 添加新图片

1. 将新图片放入 `media/gallery/` 目录
2. 按照命名规范重命名（如 `gallery-07.jpg`）
3. 运行优化脚本
4. 更新 `gallery.html` 添加新的 slide

### 替换现有图片

1. 备份当前图片（脚本会自动备份）
2. 替换文件（保持相同文件名）
3. 运行优化脚本
4. 测试网站显示效果

### 批量处理

1. 将所有图片放入 `media/gallery/` 目录
2. 运行优化脚本（会自动处理所有图片）
3. 检查汇总报告

## 🛠️ 手动优化工具

如果不想使用脚本，可以使用以下工具：

### 在线工具
- **TinyPNG**: https://tinypng.com/（支持 PNG 和 JPG）
- **Squoosh**: https://squoosh.app/（Google 开发，功能强大）
- **ImageOptim**: https://imageoptim.com/（Mac 应用）

### 桌面应用
- **ImageOptim** (Mac)
- **FileOptimizer** (Windows/Linux)
- **GIMP** (跨平台，免费)

## 📊 优化效果示例

| 图片 | 原始大小 | 优化后 | 节省 | WebP |
|------|---------|--------|------|------|
| gallery-01.jpg | 3.2 MB | 420 KB | 87% | 280 KB |
| gallery-02.jpg | 2.8 MB | 380 KB | 86% | 250 KB |
| gallery-03.jpg | 4.1 MB | 510 KB | 88% | 340 KB |

## ⚠️ 注意事项

1. **备份重要**
   - 脚本会自动创建备份
   - 建议在 Git 中提交前先测试

2. **质量平衡**
   - 质量设置过低会影响视觉效果
   - 建议从 85 开始，根据效果调整

3. **WebP 兼容性**
   - 现代浏览器都支持 WebP
   - 代码中已提供 JPG 作为后备

4. **Vercel 部署**
   - Vercel 会自动优化静态资源
   - 但预先优化可以加快部署速度

## 🔗 相关资源

- [Sharp 文档](https://sharp.pixelplumbing.com/)
- [Pillow 文档](https://pillow.readthedocs.io/)
- [WebP 格式说明](https://developers.google.com/speed/webp)
- [Vercel 静态资源优化](https://vercel.com/docs/concepts/edge-network/overview)

## 📝 更新日志

- 2024-01-XX: 初始版本，支持 JPG/PNG 优化和 WebP 生成

