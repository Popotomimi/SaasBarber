import { Schema, model, models } from "mongoose";

const clienteSchema = new Schema(
  {
    name: String,
    date: String,
    time: String,
    service: String,
    duration: Number,
    barber: String,
    phone: String,
  },
  { timestamps: true }
);

export const ClienteModel = models.Cliente || model("Cliente", clienteSchema);
