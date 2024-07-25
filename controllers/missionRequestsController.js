const {
  createMissionRequest,
  getMissionRequests,
  getMissionRequestById,
  getMissionRequestsByEmployeeId,
  updateMissionRequest,
  deleteMissionRequest,
} = require("../models/MissionRequest");

// Create a new mission request
const addMissionRequest = async (req, res) => {
  try {
    const newMissionRequest = await createMissionRequest(req.body);
    res.status(201).json(newMissionRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mission requests
const fetchMissionRequests = async (req, res) => {
  try {
    const missionRequests = await getMissionRequests();
    res.status(200).json(missionRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mission request by ID
const fetchMissionRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const missionRequest = await getMissionRequestById(id);
    if (!missionRequest) {
      res.status(404).json({ error: "Mission request not found" });
      return;
    }
    res.status(200).json(missionRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get mission requests by employee ID
const fetchMissionRequestsByEmployeeId = async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const missionRequests = await getMissionRequestsByEmployeeId(employeeId);
    res.status(200).json(missionRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update mission request by ID
const updateMissionRequestById = async (req, res) => {
  const id = parseInt(req.params.id); // Parse id from URL parameter
  const { status } = req.body; // Extract status from request body

  try {
    // Call model function to update mission request
    const updatedMissionRequest = await updateMissionRequest(id, { status });

    // Respond with updated mission request object
    res.status(200).json(updatedMissionRequest);
  } catch (error) {
    // Handle any errors and send an error response
    res.status(500).json({ error: error.message });
  }
};

// Delete mission request by ID
const deleteMissionRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedMissionRequest = await deleteMissionRequest(id);
    if (!deletedMissionRequest) {
      res.status(404).json({ error: "Mission request not found" });
      return;
    }
    res.status(200).json(deletedMissionRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addMissionRequest,
  fetchMissionRequests,
  fetchMissionRequestById,
  fetchMissionRequestsByEmployeeId,
  updateMissionRequestById,
  deleteMissionRequestById,
};
