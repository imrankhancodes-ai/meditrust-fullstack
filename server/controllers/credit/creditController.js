import CreditRequest from "../../models/creditRequestModel.js";
import User from "../../models/userModel.js";

const DEFAULT_CREDITS = 3;

const creditsOf = (user) => user?.prescriptionCredits ?? DEFAULT_CREDITS;

// GET /api/ai/credits — current balance
const getBalance = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User Not Found!");
    }
    res.status(200).json({
        credits: creditsOf(user),
        isAdmin: user.userType === "ADMIN",
    });
};

// POST /api/ai/credits/request — { requestedCredits, reason }
const requestCredits = async (req, res) => {
    const { requestedCredits = 3, reason = "" } = req.body || {};
    const amount = Number(requestedCredits);

    if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
        res.status(400);
        throw new Error("requestedCredits must be an integer between 1 and 50");
    }

    const existing = await CreditRequest.findOne({ user: req.user.id, status: "pending" });
    if (existing) {
        res.status(409);
        throw new Error("You already have a pending credit request. Please wait for admin review.");
    }

    const created = await CreditRequest.create({
        user: req.user.id,
        requestedCredits: amount,
        reason: String(reason || "").slice(0, 500),
    });

    await created.populate("user", "name email phone prescriptionCredits");
    res.status(201).json(created);
};

// GET /api/ai/credits/requests — my history
const myRequests = async (req, res) => {
    const list = await CreditRequest.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("reviewedBy", "name email");
    res.status(200).json(list);
};

// GET /api/admin/credit-requests?status=pending — full history for admin
const getAllRequests = async (req, res) => {
    const filter = {};
    if (req.query.status && ["pending", "approved", "rejected"].includes(req.query.status)) {
        filter.status = req.query.status;
    }
    const list = await CreditRequest.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", "name email phone prescriptionCredits userType")
        .populate("reviewedBy", "name email");
    res.status(200).json(list);
};

// PUT /api/admin/credit-requests/:rid — { action: approve|reject, grantedCredits?, adminNote? }
const reviewRequest = async (req, res) => {
    const { action, grantedCredits, adminNote = "" } = req.body || {};
    const rid = req.params.rid;

    if (!["approve", "reject"].includes(action)) {
        res.status(400);
        throw new Error("action must be 'approve' or 'reject'");
    }

    const creditReq = await CreditRequest.findById(rid);
    if (!creditReq) {
        res.status(404);
        throw new Error("Credit Request Not Found!");
    }
    if (creditReq.status !== "pending") {
        res.status(409);
        throw new Error(`Request already ${creditReq.status}`);
    }

    if (action === "reject") {
        creditReq.status = "rejected";
        creditReq.reviewedBy = req.user.id;
        creditReq.adminNote = String(adminNote || "").slice(0, 500);
        await creditReq.save();
        await creditReq.populate([
            { path: "user", select: "name email phone prescriptionCredits" },
            { path: "reviewedBy", select: "name email" },
        ]);
        return res.status(200).json(creditReq);
    }

    // approve
    const grant = grantedCredits === undefined || grantedCredits === null || grantedCredits === ""
        ? creditReq.requestedCredits
        : Number(grantedCredits);
    if (!Number.isInteger(grant) || grant < 1 || grant > 50) {
        res.status(400);
        throw new Error("grantedCredits must be an integer between 1 and 50");
    }

    const target = await User.findById(creditReq.user);
    if (!target) {
        res.status(404);
        throw new Error("Requesting User Not Found!");
    }

    target.prescriptionCredits = creditsOf(target) + grant;
    await target.save();

    creditReq.status = "approved";
    creditReq.grantedCredits = grant;
    creditReq.reviewedBy = req.user.id;
    creditReq.adminNote = String(adminNote || "").slice(0, 500);
    await creditReq.save();
    await creditReq.populate([
        { path: "user", select: "name email phone prescriptionCredits" },
        { path: "reviewedBy", select: "name email" },
    ]);
    return res.status(200).json(creditReq);
};

// PUT /api/admin/users/:uid/credits — direct grant { addCredits }
const grantCreditsDirect = async (req, res) => {
    const amount = Number(req.body?.addCredits);
    if (!Number.isInteger(amount) || amount < 1 || amount > 50) {
        res.status(400);
        throw new Error("addCredits must be an integer between 1 and 50");
    }
    const target = await User.findById(req.params.uid);
    if (!target) {
        res.status(404);
        throw new Error("User Not Found!");
    }
    target.prescriptionCredits = creditsOf(target) + amount;
    await target.save();

    // Record the direct grant in history as an auto-approved request
    const record = await CreditRequest.create({
        user: target._id,
        requestedCredits: amount,
        reason: "Direct grant by admin",
        status: "approved",
        grantedCredits: amount,
        reviewedBy: req.user.id,
        adminNote: String(req.body?.adminNote || "").slice(0, 500),
    });

    res.status(200).json({ user: target, record });
};

const creditController = {
    getBalance,
    requestCredits,
    myRequests,
    getAllRequests,
    reviewRequest,
    grantCreditsDirect,
};

export default creditController;
