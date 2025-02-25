const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    storeId: String, // Links to the Shopify store
    type: { type: String, enum: ["ski", "snowboard", "boots"] },
    brand: String,
    model: String,
    size: String, // "170cm", "28.5"
    quantityAvailable: Number
});

module.exports = mongoose.model("Inventory", InventorySchema);
