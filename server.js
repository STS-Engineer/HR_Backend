const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const leaveRequestsRouter = require("./routes/leaveRequests");
const missionRequestsRouter = require("./routes/missionRequests");
const authorizationRouter = require("./routes/authorizationRequests");
const docRequestsRouter = require("./routes/docRequets");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/leave-requests", leaveRequestsRouter);
app.use("/api/mission-requests", missionRequestsRouter);
app.use("/api/authorization-requests", authorizationRouter);
app.use("/api/document-requests", docRequestsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
