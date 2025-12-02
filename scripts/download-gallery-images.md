# 下载 Gallery 图片指南

当前 `gallery.html` 中的图片已改为使用本地路径，你需要下载这些图片到 `media/gallery/` 目录。

## 📥 需要下载的图片

以下是当前代码中引用的图片及其对应的临时链接：

### 1. gallery-01.jpg (温馨客厅)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/nextluxury.com/dc2eaf346839acaf04a3330aef083b123355d6bf.jpg
```

### 2. gallery-02.jpg (明亮空间)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/img.freepik.com/a5353a70a0d260bf3248e849b196f4c584c5aeae.jpg
```

### 3. gallery-03.jpg (户外露台)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/www.bhg.com/821ab6e9f73f0e1c5e1a04bcc71c9b997f89cbe5.jpg
```

### 4. gallery-04.jpg (天然材质)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/urbanbilly.com/c7246b441df5cc43ffa15971f39c17af0423ad99.jpg
```

### 5. gallery-05.jpg (阅读角落)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/i.pinimg.com/7b7fd0159bbd784fd15fedafa287fd1b71e7961b.jpg
```

### 6. gallery-06.jpg (极简美学)
**临时链接：**
```
https://kimi-web-img.moonshot.cn/img/decorilla.com/2ff14061b16f70eb6d3cec068029cee0b3bd68c9.jpg
```

## 🚀 下载方法

### 方法 1: 使用浏览器下载

1. 在浏览器中打开每个链接
2. 右键点击图片 → "另存为"
3. 保存到 `media/gallery/` 目录
4. 按照命名规范重命名（gallery-01.jpg, gallery-02.jpg 等）

### 方法 2: 使用命令行（Mac/Linux）

```bash
cd /Users/shl-macmini/Documents/my_websites/top_booking/media/gallery

# 下载所有图片
curl -o gallery-01.jpg "https://kimi-web-img.moonshot.cn/img/nextluxury.com/dc2eaf346839acaf04a3330aef083b123355d6bf.jpg"
curl -o gallery-02.jpg "https://kimi-web-img.moonshot.cn/img/img.freepik.com/a5353a70a0d260bf3248e849b196f4c584c5aeae.jpg"
curl -o gallery-03.jpg "https://kimi-web-img.moonshot.cn/img/www.bhg.com/821ab6e9f73f0e1c5e1a04bcc71c9b997f89cbe5.jpg"
curl -o gallery-04.jpg "https://kimi-web-img.moonshot.cn/img/urbanbilly.com/c7246b441df5cc43ffa15971f39c17af0423ad99.jpg"
curl -o gallery-05.jpg "https://kimi-web-img.moonshot.cn/img/i.pinimg.com/7b7fd0159bbd784fd15fedafa287fd1b71e7961b.jpg"
curl -o gallery-06.jpg "https://kimi-web-img.moonshot.cn/img/decorilla.com/2ff14061b16f70eb6d3cec068029cee0b3bd68c9.jpg"
```

### 方法 3: 使用 wget（如果已安装）

```bash
cd /Users/shl-macmini/Documents/my_websites/top_booking/media/gallery

wget -O gallery-01.jpg "https://kimi-web-img.moonshot.cn/img/nextluxury.com/dc2eaf346839acaf04a3330aef083b123355d6bf.jpg"
wget -O gallery-02.jpg "https://kimi-web-img.moonshot.cn/img/img.freepik.com/a5353a70a0d260bf3248e849b196f4c584c5aeae.jpg"
wget -O gallery-03.jpg "https://kimi-web-img.moonshot.cn/img/www.bhg.com/821ab6e9f73f0e1c5e1a04bcc71c9b997f89cbe5.jpg"
wget -O gallery-04.jpg "https://kimi-web-img.moonshot.cn/img/urbanbilly.com/c7246b441df5cc43ffa15971f39c17af0423ad99.jpg"
wget -O gallery-05.jpg "https://kimi-web-img.moonshot.cn/img/i.pinimg.com/7b7fd0159bbd784fd15fedafa287fd1b71e7961b.jpg"
wget -O gallery-06.jpg "https://kimi-web-img.moonshot.cn/img/decorilla.com/2ff14061b16f70eb6d3cec068029cee0b3bd68c9.jpg"
```

## ✅ 下载后步骤

1. **验证文件**
   ```bash
   ls -lh media/gallery/*.jpg
   ```
   应该看到 6 个文件：gallery-01.jpg 到 gallery-06.jpg

2. **运行优化脚本**
   ```bash
   npm run optimize-images
   # 或
   python3 scripts/optimize-images.py
   ```

3. **测试网站**
   - 在浏览器中打开 `gallery.html`
   - 检查所有图片是否正常显示
   - 检查全屏查看功能

4. **提交到 Git**
   ```bash
   git add media/gallery/
   git commit -m "Add gallery images"
   ```

## 🔄 替换为自定义图片

如果你想使用自己的图片：

1. 将你的图片放入 `media/gallery/` 目录
2. 按照命名规范命名（gallery-01.jpg 到 gallery-06.jpg）
3. 运行优化脚本
4. 更新 `gallery.html` 中的图片描述文字（如果需要）

## ⚠️ 注意事项

- 确保图片文件名完全匹配（gallery-01.jpg, gallery-02.jpg 等）
- 图片格式可以是 .jpg 或 .png
- 建议在下载后运行优化脚本以减小文件大小
- 如果临时链接失效，你需要使用自己的图片替换

