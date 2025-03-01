require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");
const { shopifyApp } = require("@shopify/shopify-app-express"); // ✅ Shopify Express Adapter
const { restResources } = require("@shopify/shopify-api/rest/admin/2023-10"); // ✅ Ensure API version is correct
const { NodeAdapter } = require("@shopify/shopify-api/adapters/node"); // ✅ Required Adapter


const customerRoutes = require("./routes/customers");
const rentalRoutes = require("./routes/rentals");
const inventoryRoutes = require("./routes/inventory");
const shopifyRoutes = require("./routes/shopify"); 

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Initialize Shopify API
const shopify = shopifyApi({
    adapters: [NodeAdapter],
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES.split(","),
    hostName: process.env.SHOPIFY_APP_URL.replace(/https?:\/\//, ""),
    isEmbeddedApp: true, // Set to false if this is not an embedded app
    apiVersion: LATEST_API_VERSION, // Automatically uses the latest Shopify API version
    restResources,
});


// ✅ Shopify OAuth Authentication Route
app.get("/auth", async (req, res) => {
    try {
        const session = await shopify.auth.beginAuth(
            req,
            res,
            process.env.SHOPIFY_STORE_URL,
            "/auth/callback",
            false
        );
        res.redirect(session.redirectUrl);
    } catch (error) {
        console.error("❌ Shopify Authentication Error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// ✅ Shopify OAuth Callback Route
app.get("/auth/callback", async (req, res) => {
    try {
        const session = await shopify.auth.validateAuthCallback(req, res, req.query);
        console.log("✅ Shopify Authenticated:", session);
        res.json({ message: "Shopify authentication successful!", session });
    } catch (error) {
        console.error("❌ Shopify Auth Callback Error:", error);
        res.status(500).json({ error: "Shopify authentication failed" });
    }
});


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
