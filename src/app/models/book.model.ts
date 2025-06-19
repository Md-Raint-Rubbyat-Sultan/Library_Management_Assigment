import { model, Schema } from "mongoose";
import { book } from "../interfaces/book.interface";

const bookSchema = new Schema<book>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
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
    description: { type: String, default: "NO DESCRIPTION FOUND" },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Book = model<book>("Book", bookSchema);

export default Book;
