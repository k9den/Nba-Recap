import mongoose from "mongoose";

const RecapSchema = new mongoose.Schema(
  {
    team1: String,
    team2: String,
    date: String,
    summary: String,
    videoUrl: String,
    thumbnail: String,
  },
  { timestamps: true }
);

export default mongoose.models.Recap || mongoose.model("Recap", RecapSchema);
