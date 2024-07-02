import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 128,
    unique: true,
  },
});

export default mongoose.model("Category", categorySchema);
