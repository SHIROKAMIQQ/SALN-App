export function downloadSALNAsJSON(salnFormData) {
  // Convert object to a pretty JSON string (2-space indentation)
  const jsonString = JSON.stringify(salnFormData, null, 2);

  // Create a Blob (represents the file in memory)
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  // Name your file, e.g., SALN_2025.json
  a.href = url;
  a.download = `SALN_${new Date().getFullYear()}.json`;

  // Trigger the download
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);
}