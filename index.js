import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import userRouter from "./src/routes/users.js";
import conversationRouter from "./src/routes/conversations.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();

/* 安全設定 */
mongoose.set("sanitizeFilter", true);

/* 請求限制 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    res.status(429).send({ success: false, message: "太多請求" });
  },
});
app.use(limiter);

/* 中介層 */
app.use(
  cors({
    origin: "https://ai-chatbot-zeta-flax.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(mongoSanitize());

/* 路由 */
app.use("/api/users", userRouter); // 路由前綴
app.use("/api/conversations", conversationRouter);

/* 404 處理 */
app.all("*", (req, res) => {
  res.status(404).send({ success: false, message: "找不到" });
});

/* 啟動伺服器 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
