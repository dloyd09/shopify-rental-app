const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

// Create or Update a Customer
router.post("/", async (req, res) => {
    try {
        const { email, shopifyCustomerId } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Build the query dynamically to avoid incorrect matches
        let query = { email }; // Default search by email
        if (shopifyCustomerId) {
            query = { $or: [{ email }, { shopifyCustomerId }] };
        }

        console.log(`🔍 Checking for customer with query:`, query); // Debugging

        let existingCustomer = await Customer.findOne(query);

        console.log("🔍 Found existing customer:", existingCustomer); // Debugging log

        if (existingCustomer) {
            // If found, update the customer
            const updatedCustomer = await Customer.findOneAndUpdate(
                { _id: existingCustomer._id },
                req.body,
                { new: true }
            );
            return res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
        }

        // If not found, create a new customer
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get All Customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find().populate("rentals");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
