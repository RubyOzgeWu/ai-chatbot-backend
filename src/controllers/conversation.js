import conversations from "../models/conversation.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

/* 新增對話 */
export const createConversation = async (req, res) => {
  try {
    /* 後端加壓 */
    const sessionId = req.body.session_id || uuidv4();
    const timestamp = new Date();

    /* 儲存使用者訊息在 db */
    const userMessage = await conversations.create({
      session_id: sessionId,
      role: req.body.role,
      content: req.body.content,
      timestamp,
    });

    /* call fast API */
    // const llmResponse = await axios.post(
    //   "https://15f9-125-228-140-213.ngrok-free.app/rag",
    //   {
    //     query: req.body.content,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.FASTAPI_TOKEN}`,
    //     },
    //   }
    // );
    const llmResponse = await axios.post(
      "https://15f9-125-228-140-213.ngrok-free.app/rag",
      {
        query: req.body.content,
      }
    );
    /* http://localhost:8000/rag */

    /* 儲存 LLM 回覆在 db */
    const assistantMessage = await conversations.create({
      user_id: req.body.user_id,
      session_id: sessionId,
      role: "assistant",
      content: llmResponse.data.response.answer,
      timestamp: new Date(),
    });

    /* 回傳問答給前端 */
    res.status(200).send({
      success: true,
      message: "成功建立對話並取得回應",
      assistant_message: assistantMessage,
      llm_response: llmResponse.data.response.answer,
    });
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
