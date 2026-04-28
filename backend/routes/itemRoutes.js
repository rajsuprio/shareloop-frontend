import express from "express";
import Item from "../models/Item.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET logged-in user's items
router.get("/my-items", protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.userId })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your items",
      error: error.message,
    });
  }
});

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
});

// GET single item
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email role");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message,
    });
  }
});

// POST new item
router.post("/", protect, async (req, res) => {
  try {
    const { title, category, type, price, location, image } = req.body;

    if (!title || !category || !type || !price || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newItem = new Item({
      title,
      category,
      type,
      price,
      location,
      image,
      user: req.user.userId,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      item: savedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
});

// PUT update item
router.put("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const isOwner = String(item.user) === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email role");

    res.json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
});

// DELETE item
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const isOwner = String(item.user) === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
});

export default router;