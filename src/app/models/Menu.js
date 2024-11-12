import mongoose from "mongoose";

const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const MenuSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  breakfast: {
    type: [MenuItemSchema],
    required: true,
  },
  morningSnack: {
    type: [MenuItemSchema],
    required: true,
  },
  lunch: {
    type: [MenuItemSchema],
    required: true,
  },
  afternoonSnack: {
    type: [MenuItemSchema],
    required: true,
  },
  dinner: {
    type: [MenuItemSchema],
    required: true,
  },
  supper: {
    type: [MenuItemSchema],
    required: true,
  },
});

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
