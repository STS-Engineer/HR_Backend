const express = require("express");
const router = express.Router();
const {
  addMissionRequest,
  fetchMissionRequests,
  fetchMissionRequestById,
  fetchMissionRequestsByEmployeeId,
  updateMissionRequestById,
  deleteMissionRequestById,
} = require("../controllers/missionRequestsController");

// Define routes for mission requests
router.post("/", addMissionRequest);
router.get("/", fetchMissionRequests);
router.get("/:id", fetchMissionRequestById);
router.get("/employee/:employeeId", fetchMissionRequestsByEmployeeId);
router.put("/:id", updateMissionRequestById);
router.delete("/:id", deleteMissionRequestById);

module.exports = router;
