import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";

const PORT = config.app.port;

app.listen(PORT, async () => {
  console.log(`app is running at http://localhost:${PORT}`);
  await connectDB();
});
