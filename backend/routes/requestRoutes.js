import express from "express";
import Request from "../models/Request.js";
import Item from "../models/Item.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET requests made by logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.userId })
      .populate({
        path: "itemId",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate("requester", "name email role")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

// GET requests received by item owner
router.get("/received", protect, async (req, res) => {
  try {
    const requests = await Request.find({ owner: req.user.userId })
      .populate({
        path: "itemId",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate("requester", "name email role")
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch received requests",
      error: error.message,
    });
  }
});

// POST create request
router.post("/", protect, async (req, res) => {
  try {
    const { itemId, days, note, returnDate } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (String(item.user) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own item",
      });
    }

    const existing = await Request.findOne({
      itemId,
      requester: req.user.userId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Request already exists for this item",
      });
    }

    const newRequest = await Request.create({
      itemId,
      requester: req.user.userId,
      owner: item.user,
      status: "pending",
      days: days || null,
      note: note || "",
      returnDate: returnDate || "",
    });

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create request",
      error: error.message,
    });
  }
});

// PATCH request status (owner only for accept/reject/completed)
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["accepted", "rejected", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner = String(request.owner) === req.user.userId;
    const isRequester = String(request.requester) === req.user.userId;

    if (status === "cancelled") {
      if (!isRequester) {
        return res.status(403).json({
          success: false,
          message: "Only requester can cancel this request",
        });
      }
    } else {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Only item owner can update this request status",
        });
      }
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message,
    });
  }
});

// DELETE request by itemId for requester
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const deleted = await Request.findOneAndDelete({
      itemId: req.params.itemId,
      requester: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: error.message,
    });
  }
});

export default router;