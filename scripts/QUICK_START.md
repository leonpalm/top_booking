# Gallery 图片快速开始指南

## 📋 使用本地图片的步骤

### 1. 准备图片文件

将你的图片文件放入 `media/gallery/` 目录，按照以下命名规范：

```
media/gallery/
├── gallery-01.jpg   # 温馨客厅
├── gallery-02.jpg   # 明亮空间
├── gallery-03.jpg   # 户外露台
├── gallery-04.jpg   # 天然材质
├── gallery-05.jpg   # 阅读角落
└── gallery-06.jpg   # 极简美学
```

**命名要求：**
- 文件名必须完全匹配：`gallery-01.jpg` 到 `gallery-06.jpg`
- 支持 `.jpg`、`.jpeg` 或 `.png` 格式
- 文件名使用小写字母和连字符

### 2. 图片规格建议

- **尺寸**: 宽度 1920px（高度根据内容比例）
- **格式**: JPG（推荐）或 PNG
- **文件大小**: 建议每张 < 2MB（优化前）

### 3. 优化图片（可选但推荐）

运行优化脚本以减小文件大小，提升加载速度：

```bash
# 安装依赖（首次使用）
npm install

# 运行优化
npm run optimize-images
```

或使用 Python 版本：
```bash
pip install Pillow
python3 scripts/optimize-images.py
```

优化脚本会：
- 自动压缩图片
- 创建备份（在 `media/gallery/backup/`）
- 可选生成 WebP 格式（更小体积）

### 4. 更新图片描述（可选）

如果需要修改图片标题和描述，编辑 `gallery.html`：

```html
<h3 class="font-display text-xl font-semibold mb-2">你的标题</h3>
<p class="text-gray-600 text-sm">你的描述文字</p>
```

### 5. 测试

1. 在浏览器中打开 `gallery.html`
2. 检查所有图片是否正常显示
3. 测试轮播和全屏查看功能
4. 检查 `index.html` 的预览区域

### 6. 部署到 Vercel

```bash
git add media/gallery/
git commit -m "Add gallery images"
git push
```

Vercel 会自动部署更新。

## 📝 图片对应关系

| 文件名 | 在 gallery.html 中的位置 | 在 index.html 中的位置 |
|--------|-------------------------|------------------------|
| gallery-01.jpg | 第1张轮播图（温馨客厅） | 第1张预览图 |
| gallery-02.jpg | 第2张轮播图（明亮空间） | 第2张预览图 |
| gallery-03.jpg | 第3张轮播图（户外露台） | 第3张预览图 |
| gallery-04.jpg | 第4张轮播图（天然材质） | 第4张预览图 |
| gallery-05.jpg | 第5张轮播图（阅读角落） | - |
| gallery-06.jpg | 第6张轮播图（极简美学） | - |

## 🔄 添加更多图片

如果想添加更多图片（超过6张）：

1. 将新图片放入 `media/gallery/`，命名为 `gallery-07.jpg`、`gallery-08.jpg` 等
2. 在 `gallery.html` 的 `<ul class="splide__list">` 中添加新的 `<li class="splide__slide">` 项
3. 参考现有代码格式添加

## ⚠️ 注意事项

- 确保图片文件名完全匹配（区分大小写）
- 建议在优化前先备份原始图片
- 如果图片加载失败，检查文件路径和文件名是否正确
- Vercel 会自动优化静态资源，但预先优化可以加快部署速度

## 📚 更多信息

- 详细优化指南：`scripts/IMAGE_OPTIMIZATION.md`
- 优化脚本配置：编辑 `scripts/optimize-images.js` 或 `optimize-images.py`

