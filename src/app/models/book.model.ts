import { model, Schema } from "mongoose";
import { book } from "../interfaces/book.interface";
import Borrow from "./borrow.model";

const bookSchema = new Schema<book>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      uppercase: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, default: "NO DESCRIPTION FOUND", trim: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.post("findOneAndDelete", async function (doc) {
  await Borrow.deleteMany({
    book: doc._id,
  });
});

bookSchema.method("availablity", async function (borrowedCopies: number = 0) {
  this.copies -= borrowedCopies;
  if (this.copies === 0) {
    this.available = false;
    await this.save();
  }
});

const Book = model<book>("Book", bookSchema);

export default Book;
