# 房型和价格配置说明

## 📋 配置文件

房型和价格配置存储在 `config/room-config.json` 文件中，修改此文件即可更新网站上的房型和价格信息，无需修改代码。

## 🔧 配置结构

### 房型配置 (roomTypes)

每个房型包含以下字段：

```json
{
  "id": "standard",           // 房型唯一标识（英文，用于代码识别）
  "name": "标准间",            // 房型显示名称
  "price": 680,               // 每晚价格（元）
  "area": "25平方米",          // 房间面积
  "features": ["山景阳台"],    // 特色功能列表
  "description": "舒适的标准间...",  // 房型描述
  "iconColor": "teal",         // 图标颜色（teal/blue/green/purple/orange）
  "maxGuests": 4              // 最大入住人数
}
```

### 价格规则 (pricing)

```json
{
  "baseGuests": 2,            // 基础人数（不额外收费）
  "extraGuestFee": 100,       // 超出基础人数的每人费用（元）
  "extraGuestFeePerNight": true  // true=每晚收费，false=一次性收费
}
```

### 周价格 (weeklyPrices)

```json
{
  "monday": 680,
  "tuesday": 680,
  "wednesday": 680,
  "thursday": 680,
  "friday": 780,
  "saturday": 880,
  "sunday": 880
}
```

**注意**：周价格仅用于价格趋势图展示，实际计算使用选中房型的 `price` 字段。

### 入住人数选项 (guestOptions)

```json
{
  "min": 1,      // 最少人数
  "max": 4,      // 最多人数
  "default": 2   // 默认选择人数
}
```

## 📝 修改示例

### 示例 1：修改标准间价格

将标准间价格从 680 改为 750：

```json
{
  "id": "standard",
  "name": "标准间",
  "price": 750,  // 修改这里
  ...
}
```

### 示例 2：添加新房型

在 `roomTypes` 数组中添加新项：

```json
{
  "id": "suite",
  "name": "豪华套房升级版",
  "price": 1200,
  "area": "60平方米",
  "features": ["独立客厅", "私人阳台", "按摩浴缸"],
  "description": "顶级豪华套房，享受极致舒适体验。",
  "iconColor": "purple",
  "maxGuests": 6
}
```

### 示例 3：修改额外人数费用

将超出 2 人的费用从 100 元改为 150 元：

```json
"pricing": {
  "baseGuests": 2,
  "extraGuestFee": 150,  // 修改这里
  "extraGuestFeePerNight": true
}
```

### 示例 4：修改周价格

调整周末价格：

```json
"weeklyPrices": {
  "monday": 680,
  "tuesday": 680,
  "wednesday": 680,
  "thursday": 680,
  "friday": 850,    // 修改周五价格
  "saturday": 980,   // 修改周六价格
  "sunday": 980      // 修改周日价格
}
```

## ⚠️ 注意事项

1. **JSON 格式**：确保 JSON 格式正确，可以使用在线 JSON 验证工具检查
2. **ID 唯一性**：每个房型的 `id` 必须唯一
3. **颜色选项**：`iconColor` 支持：`teal`, `blue`, `green`, `purple`, `orange`
4. **价格单位**：所有价格单位为人民币（元）
5. **保存后刷新**：修改配置文件后，刷新浏览器页面即可看到更新

## 🔄 更新流程

1. 编辑 `config/room-config.json` 文件
2. 保存文件
3. 刷新浏览器页面
4. 检查显示是否正确

## 📦 部署

配置文件会随代码一起部署到 Vercel，修改后提交到 Git 并推送即可自动部署。

## 🆘 故障排除

如果配置文件加载失败，系统会自动使用默认配置（标准间 680 元，豪华套房 880 元），确保网站正常运行。

