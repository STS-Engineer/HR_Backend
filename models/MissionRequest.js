const pool = require("../config/database");

// Check if employee exists
const employeeExists = async (employeeId) => {
  try {
    const res = await pool.query("SELECT 1 FROM users WHERE id = $1", [
      employeeId,
    ]);
    return res.rowCount > 0;
  } catch (error) {
    throw new Error(`Error checking employee existence: ${error.message}`);
  }
};

// Create a new mission request
const createMissionRequest = async (data) => {
  const {
    employeeId,
    phone,
    startDate,
    endDate,
    missionBudget,
    purposeOfTravel,
    destination,
    departureTime,
    supervisorApproval,
    status = "Pending", // Default status if not provided
  } = data;

  try {
    // Check if the employee exists
    const exists = await employeeExists(employeeId);
    if (!exists) {
      throw new Error(`Employee with ID ${employeeId} does not exist.`);
    }

    const res = await pool.query(
      `INSERT INTO mission_requests (
        employee_id, phone, start_date, end_date, mission_budget, purpose_of_travel, 
        destination, departure_time, supervisor_approval, status, request_date
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE) 
       RETURNING *`,
      [
        employeeId,
        phone,
        startDate,
        endDate,
        missionBudget,
        purposeOfTravel,
        destination,
        departureTime,
        supervisorApproval,
        status,
      ]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error creating mission request: ${error.message}`);
  }
};

// Fetch all mission requests with employee details
const getMissionRequests = async () => {
  try {
    const query = `
      SELECT 
        mr.id AS requestId,
        mr.phone,
        mr.start_date AS startDate,
        mr.end_date AS endDate,
        mr.mission_budget AS missionBudget,
        mr.purpose_of_travel AS purposeOfTravel,
        mr.destination,
        mr.departure_time AS departureTime,
        mr.supervisor_approval AS supervisorApproval,
        mr.status,
        mr.request_date AS requestDate,
        u.id AS employeeId,
        u.firstname AS firstName,
        u.lastname AS lastName,
        u.function,
        u.department
      FROM mission_requests mr
      JOIN users u ON mr.employee_id = u.id
      ORDER BY mr.request_date DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw new Error(`Error fetching mission requests: ${error.message}`);
  }
};

// Fetch a leave request by ID
const getMissionRequestById = async (id) => {
  try {
    const res = await pool.query(
      "SELECT * FROM mission_requests WHERE id = $1",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error fetching mission request: ${error.message}`);
  }
};

// Fetch leave requests by employee ID
const getMissionRequestsByEmployeeId = async (employeeId) => {
  try {
    const res = await pool.query(
      "SELECT * FROM mission_requests WHERE employee_id = $1",
      [employeeId]
    );
    return res.rows;
  } catch (error) {
    throw new Error(
      `Error fetching mission requests by employee ID: ${error.message}`
    );
  }
};

// Update a mission request by ID
const updateMissionRequest = async (id, data) => {
  const { status } = data;

  try {
    const res = await pool.query(
      `UPDATE mission_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error updating mission request: ${error.message}`);
  }
};

// Delete a mission request by ID
const deleteMissionRequest = async (id) => {
  try {
    const res = await pool.query(
      "DELETE FROM mission_requests WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error deleting mission request: ${error.message}`);
  }
};

module.exports = {
  createMissionRequest,
  getMissionRequests,
  getMissionRequestById,
  getMissionRequestsByEmployeeId,
  updateMissionRequest,
  deleteMissionRequest,
};
