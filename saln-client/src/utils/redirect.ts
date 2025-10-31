export const redirect = (path: string) => {
  const a = document.createElement("a");
  a.href = path;
  a.setAttribute("data-navigate", "");
  document.body.appendChild(a);
  a.click();
  a.remove();
};