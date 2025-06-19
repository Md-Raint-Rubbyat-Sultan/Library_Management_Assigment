import app from "./app";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

const PORT: string | 5000 = process.env.PORT || 5000;

(async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URI as string, {
      dbName: "tech-fuko",
    });
    console.log("Connected to MongoDB...");
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.log({
      message: "Failed to connect to MongoDB",
      success: false,
      error: error,
    });
  }
})();
