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

  // Send to server
  const response = await fetch(`${API_BASE_URL}/login-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  const data = await response.json();
  console.log("Server response:", data);
  return data;
}