const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const router = express.Router();

// ✅ Check if customer exists or create one in Shopify and MongoDB
router.post("/check", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        console.log(`🔍 Checking for customer in MongoDB with email: ${email}`);

        // ✅ Check if the customer exists in MongoDB
        let existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            console.log("✅ Found customer in MongoDB:", existingCustomer);
            return res.status(200).json({ message: "Customer exists", customerId: existingCustomer.shopifyCustomerId });
        }

        console.log("🛒 Customer not found in MongoDB, checking Shopify Admin API...");

        const shopifyStoreUrl = process.env.SHOPIFY_STORE_URL;
        const shopifyApiUrl = `https://${shopifyStoreUrl}/admin/api/2024-01/customers.json`;
        const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;

        // ✅ Check if customer exists in Shopify
        const shopifyLookupUrl = `https://${shopifyStoreUrl}/admin/api/2024-01/customers/search.json?query=email:${email}`;
        const shopifyResponse = await axios.get(shopifyLookupUrl, {
            headers: { "X-Shopify-Access-Token": shopifyAccessToken }
        });

        let shopifyCustomerId;

        if (shopifyResponse.data.customers.length > 0) {
            // ✅ Customer exists in Shopify, get their ID
            shopifyCustomerId = shopifyResponse.data.customers[0].id;
            console.log(`✅ Found existing Shopify customer: ${shopifyCustomerId}`);
        } else {
            // ❌ Not found in Shopify, create a new customer
            console.log("➕ Creating new customer in Shopify...");

            const shopifyCreateResponse = await axios.post(shopifyApiUrl, {
                customer: {
                    email,
                    verified_email: true,
                    send_email_invite: false
                }
            }, {
                headers: { "X-Shopify-Access-Token": shopifyAccessToken }
            });

            shopifyCustomerId = shopifyCreateResponse.data.customer.id;
            console.log(`✅ New Shopify customer created: ${shopifyCustomerId}`);
        }

        // ✅ Now save in MongoDB
        console.log("💾 Storing customer in MongoDB...");

        const newCustomer = new Customer({
            shopifyCustomerId,
            email
        });

        await newCustomer.save();

        console.log("✅ Customer successfully stored in MongoDB:", newCustomer);
        return res.status(201).json({ message: "Customer created", customerId: shopifyCustomerId });

    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
});

router.post("/add-additional", async (req, res) => {
    try {
        const { primaryRenterId, firstName, lastName, height, weight, skillLevel } = req.body;

        if (!primaryRenterId) {
            return res.status(400).json({ message: "Primary renter ID is required" });
        }

        console.log(`➕ Adding additional renter under Primary Renter ID: ${primaryRenterId}`);


        // ✅ Find the MongoDB ObjectId for the given Shopify Customer ID
        const primaryRenter = await Customer.findOne({ shopifyCustomerId: primaryRenterId });

        if (!primaryRenter) {
            return res.status(400).json({ message: "Primary renter not found in MongoDB." });
        }

        console.log(`✅ Found Primary Renter in MongoDB: ${primaryRenter._id}`);

        // ✅ Create additional renter with `parentId` as MongoDB `_id`
        const newAdditionalRenter = new Customer({
            parentId: primaryRenter._id,
            firstName,
            lastName,
            height,
            weight,
            skillLevel,
            shopifyCustomerId: null, // ✅ Ensure it's not set
            email: null // ✅ Ensure it's not required
        });

        await newAdditionalRenter.save();

        // ✅ Update the primary renter's `additionalRenters` list
        await Customer.findByIdAndUpdate(primaryRenter._id, { $push: { additionalRenters: newAdditionalRenter._id } });

        console.log("✅ Additional renter created:", newAdditionalRenter);
        return res.status(201).json({ message: "Additional renter added successfully", additionalRenterId: newAdditionalRenter._id });

    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
