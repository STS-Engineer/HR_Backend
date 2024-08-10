const express = require("express");
const cors = require("cors");
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
app.use("/auth", authRoutes);
app.use("/leave-requests", leaveRequestsRouter);
app.use("/mission-requests", missionRequestsRouter);
app.use("/authorization-requests", authorizationRouter);
app.use("/document-requests", docRequestsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
