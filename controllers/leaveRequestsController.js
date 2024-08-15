const {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  getLeaveRequestsByEmployeeId,
  updateLeaveRequest,
  deleteLeaveRequest,
} = require("../models/LeaveRequest");

const multer = require("multer");
const path = require("path");

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Create a new leave request with file upload
const addLeaveRequest = [
  upload.single("justificationFile"),
  async (req, res) => {
    try {
      const data = req.body;
      if (req.file) {
        data.justificationFile = req.file.filename;
      }
      const newLeaveRequest = await createLeaveRequest(data);
      res.status(201).json(newLeaveRequest);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];
// Get all leave requests
const fetchLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await getLeaveRequests();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leave request by ID
const fetchLeaveRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const leaveRequest = await getLeaveRequestById(id);
    if (!leaveRequest) {
      res.status(404).json({ error: "Leave request not found" });
      return;
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get leave requests by employee ID
const fetchLeaveRequestsByEmployeeId = async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const leaveRequests = await getLeaveRequestsByEmployeeId(employeeId);
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update leave request status
const updateLeaveRequestStatus = async (req, res) => {
  const id = parseInt(req.params.id); // Parse id from URL parameter
  const { status } = req.body; // Extract status from request body

  try {
    // Call model function to update leave request
    const updatedLeaveRequest = await updateLeaveRequest(id, { status });

    // Respond with updated leave request object
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    // Handle any errors and send an error response
    res.status(500).json({ error: error.message });
  }
};

// Delete leave request by ID
const removeLeaveRequest = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedLeaveRequest = await deleteLeaveRequest(id);
    res.status(200).json(deletedLeaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Function to handle file download
const downloadJustificationFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
};

module.exports = {
  addLeaveRequest,
  fetchLeaveRequests,
  fetchLeaveRequestById,
  fetchLeaveRequestsByEmployeeId,
  updateLeaveRequestStatus,
  removeLeaveRequest,
  downloadJustificationFile,
};
