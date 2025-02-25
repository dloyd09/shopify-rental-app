const express = require("express");
const Inventory = require("../models/Inventory");

const router = express.Router();

// Add New Inventory Item
router.post("/", async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Inventory Items
router.get("/", async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
