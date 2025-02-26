const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    shopifyCustomerId: { type: Number, required: true }, // ✅ Only primary renters (who have a Shopify account)
    rentalStart: { type: Date, required: true },
    rentalEnd: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Checked Out", "Returned"], default: "Pending" },

    // ✅ Store renter details here instead of `customers` collection
    renters: [
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            height: { type: String, required: true },
            weight: { type: String, required: true },
            skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
            skiLength: { type: String, required: true },
            bootSize: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Rental", RentalSchema);


