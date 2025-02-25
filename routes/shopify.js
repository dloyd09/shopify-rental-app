const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/shopify-customer", async (req, res) => {
    try {
        const appEnv = process.env.APP_ENV || "production";  // Default to production
        const shopifyStoreUrl = process.env.SHOPIFY_STORE_URL;
        const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
        const shopifyApiVersion = process.env.SHOPIFY_API_VERSION
        const shopifyApiUrl = `https://${shopifyStoreUrl}/admin/api/${shopifyApiVersion}/customers.json`;    
        
        console.log(`🔍 Environment: ${appEnv}`);
        console.log("🔍 Fetching Shopify customers...");

        if (!shopifyStoreUrl || !shopifyAccessToken) {
            console.error("❌ Missing Shopify credentials");
            return res.status(500).json({ error: "Missing Shopify credentials. Check .env file." });
        }
        
        const response = await axios.get(shopifyApiUrl, {
            headers: {
                "X-Shopify-Access-Token": shopifyAccessToken,
                "Content-Type": "application/json"
            }
        });
        //console.log("✅ Shopify API Response:", response.data);

        // ✅ Assuming first customer in list is the one currently logged in (Modify logic as needed)
        const customer = response.data.customers[0];

        if (!customer) {
            return res.status(404).json({ message: "No Shopify customer found." });
        }

        let selectedCustomer;
        if (appEnv === "development") {
            // ✅ Use a hardcoded test customer for local dev
            selectedCustomer = { id: "65f2b3e78a12345...", name: "Test User (Dev Mode)" };
            console.warn("⚠️ Using test customer in development mode:", selectedCustomer);
        } else if (req.query.customerId) {
            // ✅ Try to find a specific customer if `customerId` is passed in the request (e.g., from Shopify App Bridge)
            selectedCustomer = customers.find(c => c.id.toString() === req.query.customerId);
            if (!selectedCustomer) {
                console.warn("⚠️ Requested customer not found, defaulting to first in the list.");
                selectedCustomer = customers[0];  // Default to first if not found
            }
        } else {
            // ✅ Production/UAT: Default to the first customer (Modify this logic if needed)
            selectedCustomer = customers[0];
        }
        console.log("✅ Selected Shopify Customer:", selectedCustomer);
        res.json({ customerId: customer.id });

    } catch (error) {
        console.error("❌ Error fetching Shopify customer:", error.message);
        res.status(500).json({ error: "Failed to fetch Shopify customer." });
    }
});

module.exports = router;
