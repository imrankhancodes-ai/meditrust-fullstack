import mongoose from "mongoose";

const CreditRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requestedCredits: {
            type: Number,
            required: true,
            min: 1,
            max: 50,
            default: 3,
        },
        reason: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true,
        },
        grantedCredits: {
            type: Number,
            default: 0,
            min: 0,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        adminNote: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

CreditRequestSchema.index({ user: 1, status: 1, createdAt: -1 });

const CreditRequest = mongoose.model("CreditRequest", CreditRequestSchema);

export default CreditRequest;
