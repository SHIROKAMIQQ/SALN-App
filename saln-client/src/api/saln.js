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

export async function deleteSALN(salnID, employeeID) {
  try {
    if (!salnID) throw new Error("No salnID provided for deleteSALN");
    if (!employeeID) throw new Error("No employeeID providede for deleteSALN");

    const payload = {
      salnID: salnID,
      employeeID: employeeID,
    };

    console.log("payload:", payload);
    console.log("Made API Request to /delete-saln");
    const response = await fetch(`${API_BASE_URL}/delete-saln`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Finished API Request to /delete-saln");

    if (!response.ok) {
      console.error(response.message);
      throw new Error (`Server responsed with ${response.status}`);
    }

    const data = await response.json();
    console.log("SALN Form successfully deleted: ", data);
    return data;
  } catch (error) {
    console.error("Error deleting SALN Form from server: ", error);
    throw error;
  }
}