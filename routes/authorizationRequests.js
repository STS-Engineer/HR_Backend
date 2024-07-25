const express = require("express");
const router = express.Router();
const {
  addAuthorizationRequest,
  fetchAuthorizationRequests,
  fetchAuthorizationRequestById,
  fetchAuthorizationRequestsByEmployeeId,
  updateAuthorizationRequestById,
  deleteAuthorizationRequestById,
} = require("../controllers/authRequestsController");

// Route to create a new authorization request
router.post("/", addAuthorizationRequest);

// Route to get all authorization requests
router.get("/", fetchAuthorizationRequests);

// Route to get an authorization request by ID
router.get("/:id", fetchAuthorizationRequestById);

// Route to get authorization requests by employee ID
router.get("/employee/:employeeId", fetchAuthorizationRequestsByEmployeeId);

// Route to update an authorization request by ID
router.put("/:id", updateAuthorizationRequestById);

// Route to delete an authorization request by ID
router.delete("/:id", deleteAuthorizationRequestById);

module.exports = router;
