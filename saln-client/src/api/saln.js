import { API_BASE_URL } from "./config";

export async function submitSALN(salnData, employeeID) {
  try {
    if (!employeeID) throw new Error("No employeeID provied for submitSALN");

    const payload = {
      employeeID: employeeID,
      form: salnData,
    };
    console.log("payload", payload);
    console.log("Made API request to /submit-saln");
    const response = await fetch(`${API_BASE_URL}/submit-saln`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Finished API Request to /submit-saln");
    
    if (!response.ok) {
      throw new Error (`Server responsed with ${response.status}`);
    }

    const data = await response.json();
    console.log("SALN Form successfully sent to server: ", data);
    return data;
  } catch (error) {
    console.error("Error sending SALN Form to server:", error);
    throw error;
  }
}