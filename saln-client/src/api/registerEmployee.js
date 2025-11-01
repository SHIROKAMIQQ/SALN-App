import { v4 as uuidv4 } from "uuid";
import { API_BASE_URL } from "./config";

/**
 * Register a new employee
 * @param {string} email
 */
export async function registerEmployee(email) {
  console.log("API call to registerEmployee");
  
  if (!email) throw new Error("Email is required");

  // Generate employeeID UUID
  const employeeID = uuidv4();

  // Generate encryption key for this employee
  const cryptoKey = await crypto.subtle.generateKey(
    {name: "AES-GCM", length: 256},
    true,
    ["encrypt", "decrypt"]
  );

  // Export the key to a base64 string so it can be sent and stored into the database
  const exportedKey = await crypto.subtle.exportKey("raw", cryptoKey);
  const exportedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

  console.log(`${API_BASE_URL}/register-employee`);

  // Send to server
  const response = await fetch(`${API_BASE_URL}/register-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeID: employeeID,
      email: email,
      encryption_key: exportedKeyBase64 
    }),
  });

  const data = await response.json();
  console.log("Server response:", data);
  return data;
}