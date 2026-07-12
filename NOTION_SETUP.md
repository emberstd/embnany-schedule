# Notion 数据接入指南

## 需要准备的凭证


| 名称                    | 说明                               | 在哪里获取                                                                                                                                                      |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Integration Token** | 集成密钥，形如 `ntn_...` 或 `secret_...` | [Notion Integrations](https://www.notion.so/my-integrations) → 新建集成 → Internal Integration → 复制 **Internal Integration Secret**                            |
| **Database ID**       | 数据库 ID（32 位字符）                   | 打开 Notion 数据库页面，URL 形如 `https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...`，其中 `xxxxxxxx...` 即为 Database ID（也可在「复制链接」里取 `?v=` 前的那段 ID） |


> 本项目使用 Notion SDK v5：会先用 Database ID 自动解析 **Data Source ID** 再查询。若需手动指定，可设置 `NOTION_DATA_SOURCE_ID`。

## Notion 侧必做步骤

1. 在 [My integrations](https://www.notion.so/my-integrations) 创建集成。
2. 打开你的 **Database** 页面 → 右上角 `···` → **Connections** → 连接刚创建的集成（否则 API 返回 404）。
3. 建议数据库属性名与下表一致（可在 `.env.local` 用 `NOTION_PROP_`* 改成你的列名）：


| 属性名（默认）          | 类型                  | 说明                 |
| ---------------- | ------------------- | ------------------ |
| Title            | Title               | 活动名称               |
| Date             | Date（含时间）           | 活动日期与时间；开启「Include time」后网站自动显示如 `6:00 PM`，仅日期则显示 `TBA` |
| Location         | Text（Rich text）     | 地点或直播平台；在文字上直接添加链接即可（谷歌地图、YouTube 等），网站会读取第一个嵌入链接 |
| People           | **Multi-select**    | 嘉宾姓名标签（默认列名 `People`）；每选一个标签 = 一位嘉宾，卡片上用 ` / ` 连接显示 |
| Trending Keyword | Text                | 横线下第一行关键词          |
| Hashtag          | Text（Rich text）     | 话题标签（可带 `#`）；在文字上添加链接后，网站标签可点击跳转；无链接则纯展示 |
| Official Post    | URL                 | 官方链接               |
| Type             | Select              | 活动类型；指定类型不会出现在网站上（见下方） |

### 按 Type 隐藏活动

Notion 的**视图筛选**不会自动同步到网站 API，需要在 `.env.local` 配置要排除的类型：

```bash
# 默认已排除「聊天直播」；多个类型用英文逗号分隔
NOTION_EXCLUDE_TYPES=聊天直播,其他不想显示的类型

# 若要在网站上显示全部类型（包括聊天直播）
NOTION_EXCLUDE_TYPES=
```

列名若不是 `Type`，可设置 `NOTION_PROP_TYPE=你的列名`。

### People 多选标签设置

1. 将 **People** 列类型设为 **Multi-select**（多选）。
2. 为每位常出现的嘉宾预先添加选项（如 `Emi Thasorn`、`Bonnie Dolnun`），或输入新名字时 Notion 会自动创建标签。
3. 每条活动勾选当天到场的嘉宾即可；网站会按 Notion 中的选择顺序，用 ` / ` 显示在卡片上。

若你的列名不是 `People`（例如 `Guests`、`姓名`），在 `.env.local` 设置：

```bash
NOTION_PROP_GUESTS=你的列名
```

```bash
cp env.example .env.local
# 编辑 .env.local，填入 NOTION_API_KEY 和 NOTION_DATABASE_ID
npm run dev
```

未配置环境变量时，页面会继续使用 `schedule/data/mockSchedule.ts` 中的假数据。

## 架构说明（推荐方案）

本项目使用 **Next.js 服务端拉取**（`schedule/lib/notion/`），**不要**在浏览器里直接调用 Notion API：

- Notion API **不支持**浏览器跨域（CORS），纯前端 `fetch` 会失败。
- Token 写在前端会泄露，任何人都能在源码里看到。
- Schedule 页使用 **ISR**（`revalidate = 60`），Notion 数据最多约 1 分钟刷新一次，减轻 API 调用压力。

可选调试接口：`GET /api/schedule`（同样走服务端，不暴露密钥，缓存窗口与页面一致）。

部署到 Cloudflare 时，在 Workers Builds / Pages 项目的 **Environment variables**（Production + Preview）添加 `NOTION_API_KEY` 与 `NOTION_DATABASE_ID`。