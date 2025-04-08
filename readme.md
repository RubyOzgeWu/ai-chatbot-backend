# AI Chatbot Backend (Node.js)

這是 AI Chatbot 的 Node.js 後端服務，負責處理使用者驗證、對話紀錄管理與 API 服務。

## 📁 資料夾結構

```
src/
├── controllers/         # 控制器：處理 API 業務邏輯
│   ├── conversation.js  # 處理對話相關邏輯
│   └── users.js         # 處理使用者相關邏輯
├── middleware/          # 中介軟體：授權、內容過濾等功能
│   ├── admin.js         # 管理員權限驗證
│   ├── auth.js          # 使用者登入驗證
│   └── content.js       # 輸入內容過濾
├── models/              # 資料模型（例如 Mongoose）
│   ├── conversation.js  # 對話資料模型
│   └── user.js          # 使用者資料模型
├── passports/           # 驗證策略設定（例如 JWT 或 OAuth）
│   └── passport.js
└── routes/              # API 路由設定
    ├── conversations.js # 對話相關 API 路由
    └── users.js         # 使用者相關 API 路由
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 建立 `.env` 檔案

請建立 `.env` 檔，並設定必要變數，例如：

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_secret_key
```

### 3. 啟動伺服器

```bash
npm run dev   # 使用 nodemon 開發模式
# 或
npm start     # 一般模式
```

伺服器預設會在 [http://localhost:3000](http://localhost:3000) 運行。

## ✅ 功能簡介

- 使用者註冊與登入（JWT 驗證）
- 對話紀錄新增、查詢
- 管理員驗證中介層
- 內容過濾中介層（防止非法輸入）
- 模組化架構，易於維護與擴充

## 🧱 技術棧

- Node.js + Express
- MongoDB + Mongoose
- Passport.js（JWT 驗證策略）
- dotenv、morgan、cors 等常見套件

## 📌 注意事項

- 請確認 MongoDB 已安裝並啟動。
- 所有 API 路由皆以 `/api` 為前綴（可根據設定調整）。
- 可結合前端（如 React + Next.js）與 AI 模型 API（如 FastAPI）達成完整 AI 對話應用。

---

如有問題歡迎提問或 issue 🙌
