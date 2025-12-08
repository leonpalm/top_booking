#!/usr/bin/env python3
"""
图片优化脚本 (Python 版本)
用于优化 media/gallery/ 目录中的图片

使用方法:
    python3 scripts/optimize-images.py

依赖安装:
    pip install Pillow

功能:
- 压缩 JPG/PNG 图片
- 生成 WebP 格式（可选）
- 调整图片尺寸（可选）
- 保持原始文件备份
"""

import os
import sys
import shutil
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("❌ 错误: 未安装 Pillow 库")
    print("请先运行: pip install Pillow")
    sys.exit(1)

# 配置
CONFIG = {
    'input_dir': Path(__file__).parent.parent / 'media' / 'gallery',
    'output_dir': Path(__file__).parent.parent / 'media' / 'gallery',
    'backup_dir': Path(__file__).parent.parent / 'media' / 'gallery' / 'backup',
    
    # 图片优化选项
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
        'enabled': True  # 设置为 False 禁用 WebP 生成
    },
    
    # 尺寸调整（可选）
    'resize': {
        'enabled': False,  # 设置为 True 启用
        'max_width': 1920,
        'max_height': 1080
    },
    
    # 水印设置（可选）
    'watermark': {
        'enabled': True,  # 设置为 True 启用水印
        'text': 'live2life.top 听海之音',  # 水印文字内容
        'font_size': 50,  # 字体大小（增大）
        'color': (255, 255, 255),  # 水印颜色 (RGB)
        'opacity': 0.5,  # 透明度 (0-1)
        'position': 'bottom-right',  # 水印位置: bottom-right, bottom-left, top-right, top-left
        'margin': 50  # 距离边缘的边距（增大使文字上移）
    }
}


def format_bytes(bytes_size):
    """格式化文件大小"""
    if bytes_size == 0:
        return '0 Bytes'
    for unit in ['Bytes', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f'{bytes_size:.2f} {unit}'
        bytes_size /= 1024.0
    return f'{bytes_size:.2f} TB'


def ensure_dir(dir_path):
    """确保目录存在"""
    dir_path.mkdir(parents=True, exist_ok=True)


def optimize_image(file_path):
    """优化单张图片"""
    file_name = file_path.name
    ext = file_path.suffix.lower()
    
    # 只处理图片文件
    if ext not in ['.jpg', '.jpeg', '.png']:
        return {'skipped': True, 'file_name': file_name}
    
    try:
        original_size = file_path.stat().st_size
        
        # 创建备份
        ensure_dir(CONFIG['backup_dir'])
        backup_path = CONFIG['backup_dir'] / file_name
        if not backup_path.exists():
            shutil.copy2(file_path, backup_path)
            print(f"  📦 备份: {file_name}")
        
        # 打开图片
        with Image.open(file_path) as img:
            # 转换为 RGB（如果是 RGBA 的 PNG）
            if img.mode in ('RGBA', 'LA', 'P'):
                # 创建白色背景
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            width, height = img.size
            
            # 调整尺寸（如果启用）
            if CONFIG['resize']['enabled']:
                max_w = CONFIG['resize']['max_width']
                max_h = CONFIG['resize']['max_height']
                if width > max_w or height > max_h:
                    img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
                    print(f"  📐 调整尺寸: {width}x{height} → {img.size[0]}x{img.size[1]}")
            
            # 添加水印（如果启用）
            if CONFIG['watermark']['enabled']:
                from PIL import ImageDraw, ImageFont
                
                draw = ImageDraw.Draw(img)
                
                # 尝试使用系统字体（先尝试中文，再尝试英文）
                font = None
                font_paths = [
                    '/System/Library/Fonts/Hiragino Sans GB.ttc',  # macOS 中文黑体
                    '/System/Library/Fonts/STHeiti Medium.ttc',    # macOS 中文黑体
                    '/System/Library/Fonts/STHeiti Light.ttc',     # macOS 中文细体
                    '/System/Library/Fonts/Arial.ttf',             # macOS 英文默认字体
                    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',  # Linux
                    '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',     # Linux 中文
                ]
                
                for font_path in font_paths:
                    try:
                        font = ImageFont.truetype(font_path, CONFIG['watermark']['font_size'])
                        break
                    except (IOError, OSError):
                        continue
                
                # 如果找不到系统字体，使用默认字体
                if font is None:
                    font = ImageFont.load_default()
                    print(f"  ⚠️  使用默认字体: {font.getname()[0]}")
                else:
                    print(f"  ✏️  使用字体: {font.getname()[0]}")
                
                # 获取文字尺寸（使用 textbbox 以支持 Pillow 9.0+）
                text = CONFIG['watermark']['text']
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                # 计算水印位置
                margin = CONFIG['watermark']['margin']
                if CONFIG['watermark']['position'] == 'bottom-right':
                    x = img.width - text_width - margin
                    y = img.height - text_height - margin
                elif CONFIG['watermark']['position'] == 'bottom-left':
                    x = margin
                    y = img.height - text_height - margin
                elif CONFIG['watermark']['position'] == 'top-right':
                    x = img.width - text_width - margin
                    y = margin
                else:  # top-left
                    x = margin
                    y = margin
                
                # 添加半透明文字
                # 创建带有透明度的颜色（RGBA）
                r, g, b = CONFIG['watermark']['color']
                a = int(255 * CONFIG['watermark']['opacity'])
                
                draw.text((x, y), text, font=font, fill=(r, g, b, a))
                print(f"  💧 添加水印: '{text}' 到 {CONFIG['watermark']['position']}")
            
            # 保存优化后的原格式
            if ext in ['.jpg', '.jpeg']:
                img.save(
                    file_path,
                    'JPEG',
                    quality=CONFIG['jpeg']['quality'],
                    optimize=CONFIG['jpeg']['optimize'],
                    progressive=CONFIG['jpeg']['progressive']
                )
            elif ext == '.png':
                img.save(
                    file_path,
                    'PNG',
                    optimize=CONFIG['png']['optimize'],
                    compress_level=CONFIG['png']['compress_level']
                )
            
            new_size = file_path.stat().st_size
            saved = original_size - new_size
            saved_percent = (saved / original_size * 100) if original_size > 0 else 0
            
            result = {
                'file_name': file_name,
                'original_size': original_size,
                'new_size': new_size,
                'saved': saved,
                'saved_percent': saved_percent,
                'skipped': False
            }
            
            # 生成 WebP（如果启用）
            if CONFIG['webp']['enabled']:
                webp_path = CONFIG['output_dir'] / f"{file_path.stem}.webp"
                img.save(
                    webp_path,
                    'WEBP',
                    quality=CONFIG['webp']['quality'],
                    method=6  # 更好的压缩，但更慢
                )
                result['webp_size'] = webp_path.stat().st_size
                print(f"  🌐 生成 WebP: {webp_path.name} ({format_bytes(result['webp_size'])})")
            
            return result
            
    except Exception as e:
        print(f"  ❌ 处理失败: {file_name} - {str(e)}")
        return {'file_name': file_name, 'error': str(e), 'skipped': False}


def main():
    """主函数"""
    print('🚀 开始优化图片...\n')
    print(f"输入目录: {CONFIG['input_dir']}")
    print(f"输出目录: {CONFIG['output_dir']}")
    print(f"备份目录: {CONFIG['backup_dir']}\n")
    
    # 检查输入目录
    if not CONFIG['input_dir'].exists():
        print(f"❌ 错误: 目录不存在 {CONFIG['input_dir']}")
        print('请先创建 media/gallery/ 目录并添加图片')
        sys.exit(1)
    
    # 获取所有图片文件
    image_extensions = ['.jpg', '.jpeg', '.png']
    files = [
        f for f in CONFIG['input_dir'].iterdir()
        if f.is_file() and f.suffix.lower() in image_extensions
    ]
    
    if not files:
        print('⚠️  未找到图片文件')
        print(f"请在 {CONFIG['input_dir']} 目录中添加图片文件")
        return
    
    print(f"找到 {len(files)} 张图片\n")
    
    # 处理所有图片
    results = []
    for file_path in files:
        print(f"处理: {file_path.name}")
        result = optimize_image(file_path)
        results.append(result)
        
        if not result.get('skipped') and not result.get('error'):
            print(f"  ✓ 完成: {format_bytes(result['original_size'])} → "
                  f"{format_bytes(result['new_size'])} "
                  f"(节省 {result['saved_percent']:.1f}%)\n")
        elif result.get('skipped'):
            print(f"  ⏭️  跳过: 不是图片文件\n")
    
    # 汇总
    print('\n' + '=' * 50)
    print('📊 优化汇总')
    print('=' * 50)
    
    successful = [r for r in results if not r.get('skipped') and not r.get('error')]
    total_original = sum(r['original_size'] for r in successful)
    total_new = sum(r['new_size'] for r in successful)
    total_saved = total_original - total_new
    total_saved_percent = (total_saved / total_original * 100) if total_original > 0 else 0
    
    print(f"处理成功: {len(successful)} 张")
    print(f"原始大小: {format_bytes(total_original)}")
    print(f"优化后: {format_bytes(total_new)}")
    print(f"节省空间: {format_bytes(total_saved)} ({total_saved_percent:.1f}%)")
    
    if CONFIG['webp']['enabled']:
        total_webp = sum(r.get('webp_size', 0) for r in successful)
        print(f"WebP 总大小: {format_bytes(total_webp)}")
    
    print('\n✅ 优化完成！')
    print(f"备份文件保存在: {CONFIG['backup_dir']}")


if __name__ == '__main__':
    main()

