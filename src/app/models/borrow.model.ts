import { model, Schema } from "mongoose";
import { borrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<borrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Borrow = model<borrow>("Borrow", borrowSchema);

export default Borrow;
