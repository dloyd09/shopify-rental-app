const express = require("express");
const Rental = require("../models/Rental");
const Customer = require("../models/Customer");

const router = express.Router();

// Create a new rental
router.post("/", async (req, res) => {
    try {
        console.log("📩 Incoming Rental Request:", req.body); // ✅ Log incoming data

        const { shopifyCustomerId, rentalStart, rentalEnd, renters } = req.body;

        // ✅ Check if rentalStart and rentalEnd are valid
        if (!rentalStart || !rentalEnd) {
            console.error("❌ Missing Rental Dates");
            return res.status(400).json({ message: "Rental start and end dates are required" });
        }

        if (!shopifyCustomerId || !renters || renters.length === 0) {
            return res.status(400).json({ message: "Shopify customer ID and at least one renter are required." });
        }

        console.log(`📩 Creating rental for Shopify Customer ID: ${shopifyCustomerId}`);     

        // ✅ Create new rental document with renter details
        const newRental = new Rental({
            shopifyCustomerId,
            rentalStart,
            rentalEnd,
            renters
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
