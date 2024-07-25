const express = require("express");
const router = express.Router();
const {
  addLeaveRequest,
  fetchLeaveRequests,
  fetchLeaveRequestById,
  fetchLeaveRequestsByEmployeeId,
  updateLeaveRequestStatus,
  removeLeaveRequest,
  downloadJustificationFile,
} = require("../controllers/leaveRequestsController");

// POST request to create a leave request
router.post("/", addLeaveRequest);

// GET request to fetch all leave requests
router.get("/", fetchLeaveRequests);
// GET request to fetch leave requests by employee ID
router.get("/employee/:employeeId", fetchLeaveRequestsByEmployeeId);

// GET request to fetch a leave request by ID
router.get("/:id", fetchLeaveRequestById);

// PUT request to update leave request status
router.put("/:id", updateLeaveRequestStatus);

// DELETE request to delete a leave request by ID
router.delete("/:id", removeLeaveRequest);

// GET request to download justification file
router.get("/download/:fileName", downloadJustificationFile);

module.exports = router;
