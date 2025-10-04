import { Schema, model, models } from "mongoose";

const historySchema = new Schema({
  name: String,
  phone: String,
  amount: Number,
  dates: [Date],
  times: [String],
  services: [String],
  barbers: [String],
});

export const HistoryModel = models.History || model("History", historySchema);
