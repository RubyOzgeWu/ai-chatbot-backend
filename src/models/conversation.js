import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // user_id: {
  //   type: String,
  //   required: [true, "使用者 ID 為必填欄位"],
  //   index: true,
  // },
  session_id: {
    type: String,
    required: [true, "對話 ID 為必填欄位"],
    index: true,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "assistant"],
      message: "角色格式錯誤",
    },
    required: true,
  },
  content: {
    type: String,
    required:  [true, "內容為必填欄位"],
  },
  timestamp: {
    type: Date,
    required: [true, "時間為必填欄位"],
    default: Date.now,
  },
});

export default mongoose.model("conversations", schema);
