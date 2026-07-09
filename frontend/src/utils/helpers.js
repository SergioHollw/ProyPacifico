export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
}


