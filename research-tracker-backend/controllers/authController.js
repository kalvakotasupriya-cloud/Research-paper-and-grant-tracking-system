import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwtHelper.js";
import { createUser, findUserByEmail, findUserById } from "../models/userModel.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "researcher" } = req.body;
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, passwordHash, role });
    const user = await findUserById(userId);

    return res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const payload = { id: user.id, role: user.role, email: user.email, name: user.name };
    const token = generateToken(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    req.session.userId = user.id;
    req.session.role = user.role;

    await pool.query("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)", [
      user.id,
      token,
      expiresAt
    ]);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    const userId = req.session?.userId || req.user?.id;

    if (token && userId) {
      await pool.query("DELETE FROM sessions WHERE user_id = ? AND token = ?", [userId, token]);
    }

    req.session.destroy(() => {});
    res.clearCookie("token");

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};
