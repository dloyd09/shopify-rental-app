const express = require("express");
const Rental = require("../models/Rental");
const Customer = require("../models/Customer");

const router = express.Router();

// Create a new rental
router.post("/", async (req, res) => {
    try {
        console.log("📩 Incoming Rental Request:", req.body); // ✅ Log incoming data

        const { customerId, rentalStart, rentalEnd, skiLength, bootSize, skillLevel, specialRequests } = req.body;

        // ✅ Check if rentalStart and rentalEnd are valid
        if (!rentalStart || !rentalEnd) {
            console.error("❌ Missing Rental Dates");
            return res.status(400).json({ message: "Rental start and end dates are required" });
        }

        // ✅ Check if customerId is provided
        if (!customerId) {
            console.error("❌ Missing Shopify Customer ID");
            return res.status(400).json({ message: "Shopify Customer ID is required" });
        }

        // ✅ Lookup MongoDB customer by `shopifyCustomerId`
        const existingCustomer = await Customer.findOne({ shopifyCustomerId: customerId });

        if (!existingCustomer) {
            console.error("❌ Customer not found in MongoDB for Shopify ID:", customerId);
            return res.status(400).json({ message: "Customer not found in database." });
        }

        console.log("✅ Found MongoDB Customer:", existingCustomer.shopifyCustomerId);

        // ✅ Create the rental record
        const newRental = new Rental({
            shopifyCustomerId: existingCustomer.shopifyCustomerId,
            rentalStart,
            rentalEnd,
            skiLength,
            bootSize,
            skillLevel,
            specialRequests
        });

        //update

        await newRental.save();
        console.log("✅ Rental successfully saved:", newRental);
        res.status(201).json({ message: "Rental request submitted successfully", rental: newRental });

    } catch (err) {
        console.error("❌ Rental Submission Error:", err); // ✅ Log full error
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
