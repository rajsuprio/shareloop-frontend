import express from "express";
import User from "../models/User.js";
import Item from "../models/Item.js";
import Request from "../models/Request.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET admin summary
router.get("/summary", protect, adminOnly, async (req, res) => {
  try {
    const [usersCount, itemsCount, requestsCount] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Request.countDocuments(),
    ]);

    res.json({
      success: true,
      summary: {
        usersCount,
        itemsCount,
        requestsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin summary",
      error: error.message,
    });
  }
});

// GET all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load users",
      error: error.message,
    });
  }
});

// PATCH update user role
router.patch("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["user", "admin", "moderator", "organization"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    });
  }
});

// GET all items for moderation
router.get("/items", protect, adminOnly, async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load items",
      error: error.message,
    });
  }
});

export default router;