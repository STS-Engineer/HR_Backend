const pool = require("../config/database");
const path = require("path");
const fs = require("fs");

// Function to create a new document request
const createDocumentRequest = async (employee_id, document_type) => {
  const result = await pool.query(
    "INSERT INTO document_requests (employee_id, document_type) VALUES ($1, $2) RETURNING *",
    [employee_id, document_type]
  );
  return result.rows[0];
};

// Fetch a document request by ID
const getDocumentRequestById = async (id) => {
  try {
    const res = await pool.query(
      "SELECT * FROM document_requests WHERE id = $1",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Error fetching document request: ${error.message}`);
  }
};

// Function to get document requests for an employee
const getDocumentRequestsByEmployee = async (employee_id) => {
  const result = await pool.query(
    "SELECT * FROM document_requests WHERE employee_id = $1",
    [employee_id]
  );
  return result.rows;
};

// Function to get all document requests (for managers)
const getAllDocumentRequests = async () => {
  const result = await pool.query(
    `SELECT 
        dr.id AS requestId,
        dr.document_type AS documentType,
        dr.status,
        dr.file_path AS filePath,
        dr.request_date AS requestDate,
        u.id AS employeeId,
        u.firstname AS firstName,
        u.lastname AS lastName,
        u.function,
        u.department
     FROM document_requests dr
     JOIN users u ON dr.employee_id = u.id
     ORDER BY dr.request_date DESC`
  );
  return result.rows;
};

// Function to update a document request with the uploaded file
const uploadDocument = async (id, fileName) => {
  const result = await pool.query(
    "UPDATE document_requests SET file_path = $1, status = $2 WHERE id = $3 RETURNING *",
    [fileName, "Completed", id]
  );
  return result.rows[0];
};

// Function to delete a document request
const deleteDocumentRequest = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM document_requests WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting document request: ${error.message}`);
  }
};

// Function to handle file download
const getDocumentFilePath = (fileName) => {
  return path.join(__dirname, "../uploads", fileName);
};

module.exports = {
  createDocumentRequest,
  getDocumentRequestsByEmployee,
  getAllDocumentRequests,
  getDocumentRequestById,
  uploadDocument,
  deleteDocumentRequest,
  getDocumentFilePath,
};
