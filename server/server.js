import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import colors from "colors"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import connectDB from "./config/dbConfig.js"

dotenv.config()

import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import pathologistRoutes from "./routes/pathologistRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import errorHandler from "./middleware/errorHandler.js";



const PORT = process.env.PORT || 5000
const app = express()


// DB CONNECTION
connectDB()


// Body-Parser
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)

app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : {}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// AUTH ROUTES
app.use("/api/auth", authRoutes)

// ADMIN ROUTES
app.use("/api/admin", adminRoutes)

// A.I Routes
app.use("/api/ai", aiRoutes)

// Product Routes
app.use("/api/products", productRoutes)

// Pathologist Routes
app.use("/api/pathologist", pathologistRoutes)

// Doctor Routes
app.use("/api/doctor", doctorRoutes)

// Cart Routes
app.use("/api/cart", cartRoutes)

// Order Routes
app.use("/api/orders", orderRoutes)

// Chat Routes
app.use("/api/chat", chatRoutes)

// Health check (Render + uptime monitors)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", time: new Date().toISOString() })
})

// Serve React frontend in production (single-service Render deploy)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.join(__dirname, "..", "client", "dist")

if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist))
    // SPA fallback — everything that is not an API route serves index.html
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"))
    })
}

// Error Handler
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})