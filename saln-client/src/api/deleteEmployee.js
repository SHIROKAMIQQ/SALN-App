import { API_BASE_URL } from "./config";

export async function deleteEmployee(employeeID) {
  console.log("API Call to deleteEmployee");

  const response = await fetch(`${API_BASE_URL}/delete-employee/${employeeID}`, {
    method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		},
  });

	const data = await response.json();
	console.log("Server response:", data);
	return data;
}