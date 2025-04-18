import "dotenv/config";

export const {
  MONGODB_URI,
  NLP_API_URL,
  TOKEN_SECRET,
  FRONTEND_URLS,
  PORT = "3000",
  ...env
} = Object.fromEntries(
  Object.entries(process.env).map(([key, value]) => [key, String(value)])
);
