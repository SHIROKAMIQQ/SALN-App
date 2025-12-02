import { API_BASE_URL } from "./config";
import { swFetch } from "./swFetch.js";

export async function submitSALN(salnData, employeeID) {
  try {
    if (!salnData) throw new Error("No salnData provided for submitSALN");
    if (!employeeID) throw new Error("No employeeID provied for submitSALN");

    const payload = {
      employeeID: employeeID,
      form: salnData,
    };
    console.log("payload", payload);
    console.log("Made API request to /submit-saln");
    const response = await swFetch(`${API_BASE_URL}/submit-saln`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    console.log("swFetch response:", response);
    return await response.json();

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
    const response = await swFetch(`${API_BASE_URL}/delete-saln`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting SALN Form from server:", error);
    throw error;
  }
}

export async function fetchSalns(employeeID) {
  try {
    if (!employeeID) throw new Error("No employeeID provided for fetchSalns");

    console.log("Made API Request to /fetch-salns");
    const response = await fetch(`${API_BASE_URL}/fetch-salns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ employeeID: employeeID })
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching SALN Forms from server: ", error);
    throw error;
  }
}