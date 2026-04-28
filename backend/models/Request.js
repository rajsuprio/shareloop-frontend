import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    days: {
      type: Number,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    returnDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index({ itemId: 1, requester: 1 }, { unique: true });

const Request = mongoose.model("Request", requestSchema);

export default Request;