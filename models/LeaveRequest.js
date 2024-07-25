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
// Create a new leave request
const createLeaveRequest = async (data) => {
  const {
    employeeId,
    phone,
    leaveType,
    requestDate,
    startDate,
    endDate,
    justification,
    justificationFile,
    status = "Pending", // Default status if not provided
  } = data;

  try {
    // Check if the employee exists
    const exists = await employeeExists(employeeId);
    if (!exists) {
      throw new Error(`Employee with ID ${employeeId} does not exist.`);
    }
    const res = await pool.query(
      `INSERT INTO leave_requests (employee_id, leave_type, request_date, start_date, end_date, justification, justification_file, status, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        employeeId,
        leaveType,
        requestDate,
        startDate,
        endDate,
        justification,
        justificationFile,
        status,
        phone,
      ]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error creating leave request: ${error.message}`);
  }
};

// Fetch all leave requests with employee details
const getLeaveRequests = async () => {
  try {
    const query = `
      SELECT 
        lr.id AS requestId,
        lr.leave_type AS leaveType,
        lr.start_date AS startDate,
        lr.end_date AS endDate,
        lr.phone,
        lr.justification,
        lr.justification_file AS justificationFile,
        lr.status,
        lr.created_at AS requestDate,
        u.id AS employeeId,
        u.firstname AS firstName,
        u.lastname AS lastName,
        u.function,
        u.department
      FROM leave_requests lr
      JOIN users u ON lr.employee_id = u.id
      ORDER BY lr.created_at DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw new Error(`Error fetching leave requests: ${error.message}`);
  }
};

// Fetch a leave request by ID
const getLeaveRequestById = async (id) => {
  try {
    const res = await pool.query("SELECT * FROM leave_requests WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error fetching leave request: ${error.message}`);
  }
};
// Fetch leave requests by employee ID
const getLeaveRequestsByEmployeeId = async (employeeId) => {
  try {
    const res = await pool.query(
      "SELECT * FROM leave_requests WHERE employee_id = $1",
      [employeeId]
    );
    return res.rows;
  } catch (error) {
    throw new Error(
      `Error fetching leave requests by employee ID: ${error.message}`
    );
  }
};
// Update a leave request by ID
const updateLeaveRequest = async (id, data) => {
  const { status } = data;

  try {
    const res = await pool.query(
      `UPDATE leave_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error updating leave request: ${error.message}`);
  }
};

// Delete a leave request by ID
const deleteLeaveRequest = async (id) => {
  try {
    const res = await pool.query(
      "DELETE FROM leave_requests WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error deleting leave request: ${error.message}`);
  }
};

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  getLeaveRequestsByEmployeeId,
  updateLeaveRequest,
  deleteLeaveRequest,
};
