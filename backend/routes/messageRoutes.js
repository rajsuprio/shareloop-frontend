import express from "express";
import protect from "../middleware/authMiddleware.js";
import Thread from "../models/Thread.js";
import Message from "../models/Message.js";
import Item from "../models/Item.js";

const router = express.Router();

// GET all threads for logged-in user
router.get("/threads", protect, async (req, res) => {
  try {
    const threads = await Thread.find({
      participants: req.user.userId,
    })
      .populate("item", "title image location price type category")
      .populate("requester", "name email role")
      .populate("owner", "name email role")
      .sort({ updatedAt: -1 });

    res.json(threads);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch threads",
      error: error.message,
    });
  }
});

// GET messages of a thread
router.get("/threads/:threadId/messages", protect, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const isParticipant = thread.participants.some(
      (id) => String(id) === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this thread",
      });
    }

    const messages = await Message.find({ thread: req.params.threadId })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// CREATE or GET thread for an item
router.post("/threads", protect, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required",
      });
    }

    const item = await Item.findById(itemId).populate("user", "name email role");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (!item.user?._id) {
      return res.status(400).json({
        success: false,
        message: "Item owner not found",
      });
    }

    const requesterId = req.user.userId;
    const ownerId = String(item.user._id);

    let thread = await Thread.findOne({
      item: itemId,
      requester: requesterId,
      owner: ownerId,
    })
      .populate("item", "title image location price type category")
      .populate("requester", "name email role")
      .populate("owner", "name email role");

    if (!thread) {
      thread = await Thread.create({
        item: itemId,
        participants: [requesterId, ownerId],
        requester: requesterId,
        owner: ownerId,
      });

      thread = await Thread.findById(thread._id)
        .populate("item", "title image location price type category")
        .populate("requester", "name email role")
        .populate("owner", "name email role");
    }

    res.status(201).json({
      success: true,
      message: "Thread ready",
      thread,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create thread",
      error: error.message,
    });
  }
});

// SEND message in thread
router.post("/threads/:threadId/messages", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const thread = await Thread.findById(req.params.threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const isParticipant = thread.participants.some(
      (id) => String(id) === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send message in this thread",
      });
    }

    const message = await Message.create({
      thread: req.params.threadId,
      sender: req.user.userId,
      text: text.trim(),
    });

    await Thread.findByIdAndUpdate(req.params.threadId, {
      updatedAt: new Date(),
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email role"
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

export default router;