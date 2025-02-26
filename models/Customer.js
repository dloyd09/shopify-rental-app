const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    shopifyCustomerId: { type: Number, sparse: true, default: null }, // ✅ Allow null for additional renters
    email: { type: String, unique: true, sparse: true, default: null }, // ✅ Allow additional renters without email
    firstName: { type: String,  },
    lastName: { type: String, },
    phone: { type: String, },
    height: { type: String, },
    weight: { type: String, },
    rentals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rental" }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null }, // ✅ Store MongoDB _id
    additionalRenters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }]
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
