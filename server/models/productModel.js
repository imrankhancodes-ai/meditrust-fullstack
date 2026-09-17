import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    expiresOn: {
        type: String,
        required: true
    },
    genericName: {
        type: String,
        required: true,
        trim: true,
        default: "General"
    },
    company: {
        type: String,
        required: true,
        trim: true,
        default: "MediTrust"
    },
    category: {
        type: String,
        required: true,
        trim: true,
        default: "Tablet"
    },
    requiresPrescription: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
})


const Product = mongoose.model("Product", productSchema)

export default Product