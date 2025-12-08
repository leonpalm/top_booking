#!/usr/bin/env python3
"""
视频优化脚本
用于处理 media/intro.mp4 视频文件

功能:
- 给视频添加与图片相同的水印
- 移除视频中的音频
- 保持原始文件备份

使用方法:
    python3 scripts/optimize-video.py

依赖:
    需要安装 ffmpeg
    安装方法: brew install ffmpeg (macOS)
"""

import os
import sys
import shutil
from pathlib import Path
import subprocess

def run_ffmpeg_command(cmd):
    """执行ffmpeg命令"""
    try:
        print(f"📦 执行命令: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ 命令执行失败: {e}")
        print(f"错误输出: {e.stderr}")
        return False, e.stderr

def main():
    """主函数"""
    print('🚀 开始视频处理...')
    
    # 配置
    video_path = Path(__file__).parent.parent / 'media' / 'intro.mp4'
    backup_dir = Path(__file__).parent.parent / 'media' / 'backup'
    output_path = Path(__file__).parent.parent / 'media' / 'intro_processed.mp4'
    
    # 检查视频文件是否存在
    if not video_path.exists():
        print(f"❌ 错误: 视频文件不存在 {video_path}")
        sys.exit(1)
    
    # 创建备份目录
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # 备份原视频
    backup_path = backup_dir / 'intro_original.mp4'
    if not backup_path.exists():
        print(f"📦 备份原视频到 {backup_path}")
        shutil.copy2(video_path, backup_path)
    else:
        print(f"⚠️  备份已存在，跳过备份")
    
    # 水印参数（与图片保持一致）
    watermark_text = "live2life.top 听海之音"
    font_size = 25  # 从40改为25，更小一点
    position = "bottom-right"  # 右下角
    margin = 30  # 边距从50改为30，使文字更靠下
    opacity = 0.5  # 透明度
    color = "white"  # 颜色
    
    # 尝试的中文字体列表
    font_list = [
        '/System/Library/Fonts/Hiragino Sans GB.ttc',  # macOS 中文黑体
        '/System/Library/Fonts/STHeiti Medium.ttc',    # macOS 中文黑体
        '/System/Library/Fonts/STHeiti Light.ttc',     # macOS 中文细体
        'Arial',                                       # 英文默认字体
        'DejaVuSans',                                  # Linux 默认字体
    ]
    
    # 选择可用的字体
    selected_font = None
    for font_path in font_list:
        if os.path.exists(font_path) or font_path in ['Arial', 'DejaVuSans']:
            selected_font = font_path
            break
    
    if not selected_font:
        print("❌ 错误: 未找到可用的字体")
        sys.exit(1)
    
    print(f"📝 使用字体: {selected_font}")
    print(f"💧 水印文字: {watermark_text}")
    print(f"📐 字体大小: {font_size}px")
    print(f"📍 位置: {position} (边距: {margin}px)")
    print(f"🔍 透明度: {opacity}")
    print(f"🎨 颜色: {color}")
    
    # 计算水印位置
    if position == "bottom-right":
        x = margin
        y = margin
        drawtext_filter = f"drawtext=text='{watermark_text}':fontfile='{selected_font}':fontsize={font_size}:fontcolor={color}:alpha={opacity}:x=w-tw-{margin}:y=h-th-{margin}"
    elif position == "bottom-left":
        drawtext_filter = f"drawtext=text='{watermark_text}':fontfile='{selected_font}':fontsize={font_size}:fontcolor={color}:alpha={opacity}:x={margin}:y=h-th-{margin}"
    elif position == "top-right":
        drawtext_filter = f"drawtext=text='{watermark_text}':fontfile='{selected_font}':fontsize={font_size}:fontcolor={color}:alpha={opacity}:x=w-tw-{margin}:y={margin}"
    else:  # top-left
        drawtext_filter = f"drawtext=text='{watermark_text}':fontfile='{selected_font}':fontsize={font_size}:fontcolor={color}:alpha={opacity}:x={margin}:y={margin}"
    
    # 构建ffmpeg命令
    # -i: 输入文件
    # -vf: 视频滤镜（添加水印）
    # -an: 移除音频
    # -c:v: 视频编码器
    # -crf: 视频质量（0-51，0为无损）
    # -preset: 编码速度（slower = 更好的压缩）
    cmd = [
        'ffmpeg',
        '-i', str(video_path),
        '-vf', drawtext_filter,
        '-an',  # 移除音频
        '-c:v', 'libx264',
        '-crf', '18',  # 高质量（18-24是合理范围）
        '-preset', 'medium',
        '-y',  # 覆盖输出文件
        str(output_path)
    ]
    
    # 执行ffmpeg命令
    print("\n🎬 开始处理视频...")
    success, output = run_ffmpeg_command(cmd)
    
    if success:
        print("✅ 视频处理完成!")
        
        # 验证输出文件
        if output_path.exists():
            original_size = video_path.stat().st_size
            processed_size = output_path.stat().st_size
            
            print(f"📊 处理前后对比:")
            print(f"   原始视频: {original_size / (1024 * 1024):.2f} MB")
            print(f"   处理后: {processed_size / (1024 * 1024):.2f} MB")
            
            # 替换原视频文件
            print("\n🔄 替换原视频文件...")
            temp_path = video_path.with_suffix('.mp4.bak')
            if temp_path.exists():
                os.remove(temp_path)
            
            os.rename(video_path, temp_path)  # 重命名原视频为临时文件
            os.rename(output_path, video_path)  # 重命名处理后的视频为原文件名
            
            print("✅ 视频已更新!")
            print(f"📁 原视频备份在: {temp_path}")
            print(f"📁 处理后的视频: {video_path}")
            
            # 清理临时文件
            os.remove(temp_path)
            print(f"🗑️  已清理临时文件")
            
        else:
            print("❌ 错误: 处理后的视频文件不存在")
    else:
        print("❌ 视频处理失败")
        sys.exit(1)
    
    print("\n🎉 所有操作完成!")

if __name__ == '__main__':
    main()