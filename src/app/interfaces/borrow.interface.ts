import { Types } from "mongoose";

interface borrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export { borrow };
