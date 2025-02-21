import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending, shipped, canceled
  totalAmount: { type: Number, required: true },
  trackingID: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
