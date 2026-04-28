import express from "express";
import SavedItem from "../models/SavedItem.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET logged-in user's saved items
router.get("/", protect, async (req, res) => {
  try {
    const savedItems = await SavedItem.find({ user: req.user.userId })
      .populate({
        path: "itemId",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(savedItems);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved items",
      error: error.message,
    });
  }
});

// POST save item for logged-in user
router.post("/", protect, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required",
      });
    }

    const existing = await SavedItem.findOne({
      itemId,
      user: req.user.userId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Item already saved",
      });
    }

    const savedItem = await SavedItem.create({
      itemId,
      user: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Item saved successfully",
      savedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save item",
      error: error.message,
    });
  }
});

// DELETE saved item for logged-in user by itemId
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const deleted = await SavedItem.findOneAndDelete({
      itemId: req.params.itemId,
      user: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved item not found",
      });
    }

    res.json({
      success: true,
      message: "Saved item removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove saved item",
      error: error.message,
    });
  }
});

export default router;