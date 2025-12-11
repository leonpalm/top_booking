#!/bin/bash

# 简单可靠的部署脚本
# 自动提交当前更改并推送到远程仓库

# 设置错误时退出
set -e

echo "=== 开始部署流程 ==="

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "错误：当前目录不是git仓库"
    exit 1
fi

# 检查是否有未暂存的更改
if ! git diff --exit-code > /dev/null 2>&1; then
    echo "检测到未暂存的更改，自动添加所有更改"
    git add -A
fi

# 检查是否有已暂存但未提交的更改
if ! git diff --cached --exit-code > /dev/null 2>&1; then
    # 使用当前日期时间作为提交信息
    COMMIT_MSG="deploy $(date +%F-%T)"
    echo "提交更改：$COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    
    # 自动推送到远程仓库
    echo "推送到远程仓库"
    git push origin main
else
    echo "没有需要提交的更改"
fi

echo "=== 部署流程完成 ==="