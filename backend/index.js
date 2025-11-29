const app = require("./app");
// JUST COMMENTING BECAUSE DB IS NOT PRESENT ON MY LOCAL MACHINE (OTHERWISE THE SERVER WILL CRASH)
// const connectDatabase = require("./config/database");
// const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 4000;

// UncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


