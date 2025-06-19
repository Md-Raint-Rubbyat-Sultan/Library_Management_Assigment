import { model, Schema } from "mongoose";
import { borrow } from "../interfaces/borrow.interface";
import Book from "./book.model";

const borrowSchema = new Schema<borrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: {
      type: Date,
      required: true,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date;
      },
    },
  },
  { timestamps: true, versionKey: false }
);

borrowSchema.post<borrow>("save", async function () {
  const bookDoc = await Book.findById(this.book);
  if (bookDoc) {
    bookDoc.copies -= this.quantity;
    await bookDoc.save();
  }
});
const Borrow = model<borrow>("Borrow", borrowSchema);

export default Borrow;
