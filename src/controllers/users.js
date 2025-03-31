import users from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* 註冊 */
export const createUser = async (req, res) => {
  const password = req.body.password;
  // bcrypt 加密
  req.body.password = bcrypt.hashSync(password, 10);
  try {
    await users.create(req.body);
    res.status(200).send({ success: true, message: "" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const key = Object.keys(error.errors)[0];
      const message = error.errors[key].message;
      return res.status(400).send({ success: false, message });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      res
        .status(400)
        .send({ success: false, message: "帳號已存在" });
    } else {
      res.status(500).send({ success: false, message: "error" });
    }
  }
};

/* 取得使用者資訊 */
export const readUser = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "已取得使用者資訊",
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "error" });
  }
};

/* 登入 */
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, {
      expiresIn: "7 days",
    });
    req.user.tokens.push(token);
    await req.user.save();
    res.status(200).send({
      success: true,
      message: "已登入",
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "error" });
  }
};

/* 登出 */
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.status(200).send({ success: true, message: "已登出" });
  } catch (error) {
    res.status(500).send({ success: false, message: "error" });
  }
};

/* 登入期限 */
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token);
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, {
      expiresIn: "7 days",
    });
    req.user.tokens[idx] = token;
    await req.user.save();
    res
      .status(200)
      .send({ success: true, message: "繼續維持登入狀態", result: token });
  } catch (error) {
    res.status(500).send({ success: false, message: "error" });
  }
};

// getUsers------------------------------------------------------------------------------------
// export const getUsers = async (req, res) => {
//   try {
//     const result = await users.find();
//     res.status(200).send({ success: true, message: "", result });
//   } catch (error) {
//     res.status(500).send({ success: false, message: "error" });
//   }
// };

// deleteUser--------------------------------------------------------------------------
// export const deleteUser = async (req, res) => {
//   try {
//     await users.findByIdAndDelete(req.params.id);
//     // await orders.deleteMany({ user: req.params.id })
//     res.status(200).send({ success: true, message: "" });
//   } catch (error) {
//     res.status(500).send({ success: false, message: "error" });
//   }
// };
