import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedItemSchema.index({ itemId: 1, user: 1 }, { unique: true });

const SavedItem = mongoose.model("SavedItem", savedItemSchema);

export default SavedItem;