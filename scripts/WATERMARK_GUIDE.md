# 图片水印功能使用指南

## 功能概述

本指南介绍如何使用优化图片脚本中的水印功能，该功能允许您在处理图片时自动添加自定义水印。

## 启用与配置

### 配置选项

在 `scripts/optimize-images.py` 文件中，您可以找到水印相关的配置选项：

```python
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
```

### 配置说明

| 配置项 | 说明 | 默认值 | 可选值 |
|-------|------|-------|-------|
| enabled | 是否启用 | False | True/False |
| text | 水印文字内容 | '听海之音民宿' | 任意字符串 |
| font_size | 字体大小（像素） | 36 | 任意正整数 |
| color | 水印颜色 | (255, 255, 255) | RGB 元组 (0-255, 0-255, 0-255) |
| opacity | 透明度 | 0.5 | 0-1 之间的小数 |
| position | 水印位置 | 'bottom-right' | 'bottom-right', 'bottom-left', 'top-right', 'top-left' |
| margin | 距离边缘的边距（像素） | 20 | 任意非负整数 |

### 启用步骤

1. 打开 `scripts/optimize-images.py` 文件
2. 将 `'enabled'` 设置从 `False` 改为 `True`
3. 根据需要调整其他配置选项

## 使用方法

### 运行脚本

配置好水印选项后，按照正常方式运行图片优化脚本：

```bash
cd /Users/shl-macmini/Documents/my_websites/top_booking
python scripts/optimize-images.py
```

### 脚本输出示例

```
📁 开始处理目录: /Users/shl-macmini/Documents/my_websites/top_booking/media/gallery

⚙️ 处理: gallery-01.jpg
  📦 备份: gallery-01.jpg
  ✏️ 使用字体: PingFang SC
  💧 添加水印: '听海之音民宿' 到 bottom-right
  🌐 生成 WebP: gallery-01.webp (45.2 KB)

⚙️ 处理: gallery-02.jpg
  📦 备份: gallery-02.jpg
  ✏️ 使用字体: PingFang SC
  💧 添加水印: '听海之音民宿' 到 bottom-right
  🌐 生成 WebP: gallery-02.webp (52.1 KB)

📊 优化统计报告:
- 总处理图片: 2
- 成功优化: 2
- 跳过文件: 0
- 总原始大小: 2.1 MB
- 优化后大小: 1.2 MB
- 空间节省: 0.9 MB (42.9%)
- 生成 WebP: 2 张 (平均节省 45.6%)
```

## 高级配置示例

### 示例 1: 深色水印

```python
'watermark': {
    'enabled': True,
    'text': '碧桂园十里银滩',
    'font_size': 48,
    'color': (0, 0, 0),  # 黑色
    'opacity': 0.6,
    'position': 'top-left',
    'margin': 30
}
```

### 示例 2: 彩色水印

```python
'watermark': {
    'enabled': True,
    'text': '月租民宿 · 大户型',
    'font_size': 32,
    'color': (255, 0, 0),  # 红色
    'opacity': 0.7,
    'position': 'bottom-left',
    'margin': 25
}
```

### 示例 3: 小字体水印

```python
'watermark': {
    'enabled': True,
    'text': '© 听海之音民宿 2024',
    'font_size': 24,
    'color': (255, 255, 255),
    'opacity': 0.4,
    'position': 'bottom-right',
    'margin': 15
}
```

## 字体说明

脚本会自动尝试以下字体路径：

1. macOS 中文默认字体: `/System/Library/Fonts/PingFang.ttc`
2. macOS 英文默认字体: `/System/Library/Fonts/Arial.ttf`
3. Linux 英文默认字体: `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`
4. Linux 中文默认字体: `/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc`

如果找不到上述字体，脚本会使用 Pillow 库的默认字体。

## 注意事项

1. **原始图片备份**: 脚本会自动备份原始图片到 `media/gallery/backup` 目录，以防操作失误
2. **字体兼容性**: 确保您的系统上有支持中文的字体，否则中文水印可能无法正常显示
3. **批量处理**: 水印功能会自动应用到所有处理的图片上
4. **透明度**: 建议将透明度设置在 0.3-0.7 之间，既能保护版权又不影响图片美观
5. **位置选择**: 根据图片内容选择合适的位置，避免遮挡重要内容

## 关闭水印

要关闭水印功能，只需将配置中的 `'enabled'` 设置改回 `False`：

```python
'watermark': {
    'enabled': False,
    # 其他配置保持不变
}
```
