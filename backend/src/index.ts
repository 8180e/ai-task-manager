import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.config.js";
import { PORT } from "./config/env.config.js";

connectDB();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

process.on("SIGINT", async () => {
  await disconnectDB();
  console.log("Server shutting down.");
  process.exit(0);
});
