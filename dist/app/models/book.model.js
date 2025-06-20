"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
    isbn: { type: Number, required: true, unique: true },
    description: { type: String, default: "NO DESCRIPTION FOUND", trim: true },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
// need to create the instance of the book model here
bookSchema.method("availablity", function (borrowedCopies = 0) {
    this.copies -= borrowedCopies;
    if (this.copies === 0) {
        this.available = false;
        this.save();
    }
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
