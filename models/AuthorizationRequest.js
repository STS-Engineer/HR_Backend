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

// Create a new authorization request
const createAuthorizationRequest = async (data) => {
  const {
    employeeId,
    phone,
    authorizationDate,
    departureTime,
    returnTime,
    purposeOfAuthorization,
    status = "Pending", // Default status if not provided
  } = data;

  try {
    // Check if the employee exists
    const exists = await employeeExists(employeeId);
    if (!exists) {
      throw new Error(`Employee with ID ${employeeId} does not exist.`);
    }

    const res = await pool.query(
      `INSERT INTO authorization_requests (employee_id, phone, authorization_date, departure_time, return_time, purpose_of_authorization, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        employeeId,
        phone,
        authorizationDate,
        departureTime,
        returnTime,
        purposeOfAuthorization,
        status,
      ]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error creating authorization request: ${error.message}`);
  }
};

// Fetch all authorization requests with employee details
const getAuthorizationRequests = async () => {
  try {
    const query = `
      SELECT 
        ar.id AS requestId,
        ar.phone,
        ar.authorization_date AS authorizationDate,
        ar.departure_time AS departureTime,
        ar.return_time AS returnTime,
        ar.purpose_of_authorization AS purposeOfAuthorization,
        ar.status,
        ar.created_at AS requestDate,
        u.id AS employeeId,
        u.firstname AS firstName,
        u.lastname AS lastName,
        u.function,
        u.department
      FROM authorization_requests ar
      JOIN users u ON ar.employee_id = u.id
      ORDER BY ar.created_at DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw new Error(`Error fetching authorization requests: ${error.message}`);
  }
};

// Fetch an authorization request by ID
const getAuthorizationRequestById = async (id) => {
  try {
    const res = await pool.query(
      "SELECT * FROM authorization_requests WHERE id = $1",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error fetching authorization request: ${error.message}`);
  }
};

// Fetch authorization requests by employee ID
const getAuthorizationRequestsByEmployeeId = async (employeeId) => {
  try {
    const res = await pool.query(
      "SELECT * FROM authorization_requests WHERE employee_id = $1",
      [employeeId]
    );
    return res.rows;
  } catch (error) {
    throw new Error(
      `Error fetching authorization requests by employee ID: ${error.message}`
    );
  }
};

// Update an authorization request by ID
const updateAuthorizationRequest = async (id, data) => {
  const { status } = data;

  try {
    const res = await pool.query(
      `UPDATE authorization_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error updating authorization request: ${error.message}`);
  }
};

// Delete an authorization request by ID
const deleteAuthorizationRequest = async (id) => {
  try {
    const res = await pool.query(
      "DELETE FROM authorization_requests WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error deleting authorization request: ${error.message}`);
  }
};

module.exports = {
  createAuthorizationRequest,
  getAuthorizationRequests,
  getAuthorizationRequestById,
  getAuthorizationRequestsByEmployeeId,
  updateAuthorizationRequest,
  deleteAuthorizationRequest,
};
