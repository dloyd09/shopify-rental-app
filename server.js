require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const customerRoutes = require("./routes/customers");
const rentalRoutes = require("./routes/rentals");
const inventoryRoutes = require("./routes/inventory");
const shopifyRoutes = require("./routes/shopify"); 

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected to snow-rentals"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/customers", customerRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api", shopifyRoutes); 

app.get("/", (req, res) => {
    res.send("🏂 Snow Rentals API is Running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
