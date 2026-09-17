import { GoogleGenAI } from "@google/genai"
import ChatMessage from "../../models/chatMessageModel.js"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_INSTRUCTION = `You are MediTrust's basic health guidance assistant. Rules you MUST follow:
- Give only general, non-diagnostic health information.
- Never provide a diagnosis and never recommend specific dosages.
- Keep answers short and easy to understand.
- Always suggest booking a real doctor on MediTrust for anything specific or urgent.
- If the question is an emergency or serious symptom, urge seeking immediate professional care.`

const getHistory = async (req, res) => {

    const messages = await ChatMessage.find({ user: req.user.id }).sort({ createdAt: 1 })

    res.status(200).json(messages)

}

const sendMessage = async (req, res) => {

    const { message } = req.body

    if (!message || !message.trim()) {
        res.status(409)
        throw new Error("Message Required!")
    }

    const userMsg = await ChatMessage.create({
        user: req.user.id,
        sender: "user",
        message: message.trim()
    })

    const history = await ChatMessage.find({ user: req.user.id }).sort({ createdAt: 1 }).limit(20)

    const contents = [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
        ...history.map((m) => ({
            role: m.sender === "ai" ? "model" : "user",
            parts: [{ text: m.message }]
        }))
    ]

    let replyText = "I'm having trouble responding right now. Please try again or book a doctor consultation."

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents
        })
        if (response.text) {
            replyText = response.text
        }
    } catch (err) {
        console.error("Chat AI error:", err.message)
    }

    const aiMsg = await ChatMessage.create({
        user: req.user.id,
        sender: "ai",
        message: replyText
    })

    res.status(201).json({ userMessage: userMsg, aiMessage: aiMsg })

}

const chatController = {
    getHistory,
    sendMessage
}

export default chatController
