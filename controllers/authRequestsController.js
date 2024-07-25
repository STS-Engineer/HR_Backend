const {
  createAuthorizationRequest,
  getAuthorizationRequests,
  getAuthorizationRequestById,
  getAuthorizationRequestsByEmployeeId,
  updateAuthorizationRequest,
  deleteAuthorizationRequest,
} = require("../models/AuthorizationRequest");

// Create a new authorization request
const addAuthorizationRequest = async (req, res) => {
  try {
    const newAuthorizationRequest = await createAuthorizationRequest(req.body);
    res.status(201).json(newAuthorizationRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all authorization requests
const fetchAuthorizationRequests = async (req, res) => {
  try {
    const authorizationRequests = await getAuthorizationRequests();
    res.status(200).json(authorizationRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get authorization request by ID
const fetchAuthorizationRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const authorizationRequest = await getAuthorizationRequestById(id);
    if (!authorizationRequest) {
      res.status(404).json({ error: "Authorization request not found" });
      return;
    }
    res.status(200).json(authorizationRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get authorization requests by employee ID
const fetchAuthorizationRequestsByEmployeeId = async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const authorizationRequests = await getAuthorizationRequestsByEmployeeId(
      employeeId
    );
    res.status(200).json(authorizationRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update authorization request by ID
const updateAuthorizationRequestById = async (req, res) => {
  const id = parseInt(req.params.id); // Parse id from URL parameter
  const { status } = req.body; // Extract status from request body

  try {
    // Call model function to update authorization request
    const updatedAuthorizationRequest = await updateAuthorizationRequest(id, {
      status,
    });

    // Respond with updated authorization request object
    res.status(200).json(updatedAuthorizationRequest);
  } catch (error) {
    // Handle any errors and send an error response
    res.status(500).json({ error: error.message });
  }
};

// Delete authorization request by ID
const deleteAuthorizationRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAuthorizationRequest = await deleteAuthorizationRequest(id);
    if (!deletedAuthorizationRequest) {
      res.status(404).json({ error: "Authorization request not found" });
      return;
    }
    res.status(200).json(deletedAuthorizationRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addAuthorizationRequest,
  fetchAuthorizationRequests,
  fetchAuthorizationRequestById,
  fetchAuthorizationRequestsByEmployeeId,
  updateAuthorizationRequestById,
  deleteAuthorizationRequestById,
};
