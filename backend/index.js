import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Allow requests from specific origin with required methods
const corsOptions = {
  origin: "https://supplysavvy-website-frontend.vercel.app",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true, // Enable credentials (cookies, authorization headers) if needed
};

app.use(cors(corsOptions));

// Serve static files (if applicable)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Define your API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Example API endpoint
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Root route handler
app.get("/", (req, res) => {
  res.send("SupplySavvy API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
