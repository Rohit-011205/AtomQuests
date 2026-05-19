import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors"
import authRoutes from './routes/authRoutes.js';
import goalRoutes from "./routes/goalRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import checkinRoutes from './routes/checkinRoutes.js'

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
   credentials: true     
}));
app.use(express.json());

const port = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server only after DB connection
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/report", reportRoutes);
