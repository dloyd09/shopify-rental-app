const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    shopifyCustomerId: { type: Number, unique:true, required:true }, // Links to Shopify customers
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null }, // Parent-child rentals
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    height: String,
    weight: String,
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    rentals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rental" }]
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
