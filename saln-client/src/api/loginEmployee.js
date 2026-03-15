import { v4 as uuidv4 } from "uuid";
import { API_BASE_URL } from "./config";

// For now just a copy of register employee
/**
 * Logs into an employee account
 * @param {string} email
 */
export async function loginEmployee(email) {
  console.log("API call to loginEmployee");
  
  if (!email) throw new Error("Email is required");

  // Geenerate a temporary employeeID UUID.
  // If email exists, this UUID will be disregarded
  // If email is new, this UUID will be used by db as employeeID
  const employeeID = uuidv4();

  // Send to server
  console.log(`attempting to fetch form ${API_BASE_URL}/login-employee`);
  const response = await fetch(`${API_BASE_URL}/login-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeID: employeeID,
      email: email,
    }),
  });

  const data = await response.json();
  console.log("Server response:", data);
  return data;
}