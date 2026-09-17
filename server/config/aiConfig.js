// Single source of truth for the Gemini model used by the whole backend
// (prescription extraction, availability matching, health chat).
// Google retires model versions regularly (e.g. gemini-2.5-flash returned
// 404 "no longer available to new users"), so the model id lives here and
// can be overridden per-environment without touching controllers:
//
//   GEMINI_MODEL=gemini-3.6-flash
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash"

export default GEMINI_MODEL
