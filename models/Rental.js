const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    shopifyCustomerId: { type: Number, required: true },
    rentalStart: { type: Date, required: true },
    rentalEnd: { type: Date, required: true },
    skiLength: String,
    bootSize: String,
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    specialRequests: String,
    storeId: String, // Optional: Can be used later if needed
    status: { type: String, enum: ["Pending", "Approved", "Checked Out", "Returned"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Rental", RentalSchema);

