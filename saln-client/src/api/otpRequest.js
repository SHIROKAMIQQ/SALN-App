import { API_BASE_URL } from "./config";

/**
 * Request OTP generation for employee's email
 * @param { string } email
 */

export async function otpRequest(email) {
  console.log("API call to otpRequest");

  if (!email) throw new Error("Email is required");

  // Send request to server
  const response = await fetch(`${API_BASE_URL}/request-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email
    }),
  });

  const data = await response.json();
  console.log("Server response:", data);
  return data;
}