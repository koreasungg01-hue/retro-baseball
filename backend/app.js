const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const webtoonRoutes = require("./routes/webtoon.routes");
const walletRoutes = require("./routes/wallet.routes");
const purchaseRoutes = require("./routes/purchase.routes");

const {
  notFound,
  errorHandler
} = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "100kb" }));

app.use("/api", rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BANGKKU TOONGKU API"
  });
});

app.use("/api/webtoons", webtoonRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
