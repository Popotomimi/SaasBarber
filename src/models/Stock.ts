import { model, models, Schema } from "mongoose";

const stockSchema = new Schema(
  {
    gel: { type: Number },
    pomadaPequena: { type: Number },
    pomadaGrande: { type: Number },
    cervejaCorona: { type: Number },
    cervejaBudweiser: { type: Number },
    cocacola: { type: Number },
    guarana: { type: Number },
    agua: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Stock = models.StockModel || model("StockModel", stockSchema);
