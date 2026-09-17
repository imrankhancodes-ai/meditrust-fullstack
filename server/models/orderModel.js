import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        default: "placed"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    sourcePrescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
        default: null
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)

export default Order
