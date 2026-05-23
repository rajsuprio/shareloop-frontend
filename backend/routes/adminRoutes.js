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

// DELETE user (and clean up their items/requests)
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // remove user's items and related requests
    await Item.deleteMany({ user: userId });
    await Request.deleteMany({ $or: [{ requester: userId }, { owner: userId }] });

    res.json({ success: true, message: "User and related data deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
});

// PATCH ban/unban user
router.patch("/users/:id/ban", protect, adminOnly, async (req, res) => {
  try {
    const { banned } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: !!banned },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: `User ${user.banned ? "banned" : "unbanned"} successfully`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update ban status", error: error.message });
  }
});

// GET all requests (admin)
router.get("/requests", protect, adminOnly, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate({
        path: "itemId",
        populate: { path: "user", select: "name email role" },
      })
      .populate("requester", "name email role")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load requests", error: error.message });
  }
});

// PATCH request status (admin override)
router.patch("/requests/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["accepted", "rejected", "completed", "cancelled", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ success: true, message: "Request status updated", request });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update request", error: error.message });
  }
});

// PATCH moderate item (approve/reject/feature/available)
router.patch("/items/:id/moderate", protect, adminOnly, async (req, res) => {
  try {
    const { status, available, featured } = req.body;

    const update = {};
    if (status) {
      const allowed = ["pending", "approved", "rejected"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      update.status = status;
    }
    if (typeof available !== "undefined") update.available = !!available;
    if (typeof featured !== "undefined") update.featured = !!featured;

    const item = await Item.findByIdAndUpdate(req.params.id, update, { new: true }).populate("user", "name email role");

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item moderation updated", item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to moderate item", error: error.message });
  }
});

export default router;