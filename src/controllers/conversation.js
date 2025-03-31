import conversations from "../models/conversation.js";
import { v4 as uuidv4 } from "uuid";

/* 新增對話 */
export const createConversation = async (req, res) => {
  try {
    const sessionId = req.body.session_id || uuidv4(); // 後端加壓 uuid 唯一值
    const timestamp = new Date();

    const result = await conversations.create({
      user_id: req.body.user_id,
      session_id: sessionId,
      role: req.body.role,
      content: req.body.content,
      timestamp,
    });
    res
      .status(200)
      .send({ success: true, message: "成功建立對話紀錄", result });
  } catch (error) {
    if (error.name === "ValidationError") {
      const key = Object.keys(error.errors)[0];
      const message = error.errors[key].message;
      return res.status(400).send({ success: false, message });
    } else {
      console.error(error);
      res.status(500).send({ success: false, message: "error" });
    }
  }
};

/* 取得單一對話 */
export const readConversation = async (req, res) => {
  try {
    const result = await conversations
      .find({ session_id: req.params.session_id })
      .sort({ timestamp: 1 });
    res
      .status(200)
      .send({ success: true, message: "成功取得單一對話紀錄", result });
  } catch (error) {
    res.status(500).send({ success: false, message: "error" });
  }
};

/* 取得所有對話 */
export const readConversations = async (req, res) => {
  try {
    const result = await conversations.aggregate([
      { $match: { user_id: req.params.user_id } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$session_id",
          latest_message: { $first: "$content" },
          latest_time: { $first: "$timestamp" },
        },
      },
      { $sort: { latest_time: -1 } }, // 最新對話排前面
    ]);

    res
      .status(200)
      .send({ success: true, message: "成功取得所有對話紀錄", result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "error" });
  }
};

/* 刪除所有對話 */
export const deleteConversations = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const result = await conversations.deleteMany({ user_id: userId });

    res.status(200).send({
      success: true,
      message: `成功刪除使用者 ${userId} 的所有對話紀錄`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};
