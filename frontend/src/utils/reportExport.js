import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function tieneDatos(obj) {
  return obj && Object.keys(obj).length > 0;
}

export function exportCSV(stats) {
  const rows = [];
  rows.push(["Reporte de Tickets"]);
  rows.push(["Generado", new Date().toLocaleString()]);
  rows.push([]);

  rows.push(["Resumen"]);
  rows.push(["Total tickets", stats?.total_tickets || 0]);
  rows.push(["Abiertos", stats?.tickets_abiertos || 0]);
  rows.push(["Cerrados", stats?.tickets_cerrados || 0]);
  rows.push([]);

  if (tieneDatos(stats?.tickets_por_estado)) {
    rows.push(["Tickets por estado"]);
    Object.entries(stats.tickets_por_estado).forEach(([estado, count]) => {
      rows.push([estado.replace("_", " "), count]);
    });
    rows.push([]);
  }

  if (tieneDatos(stats?.tickets_por_prioridad)) {
    rows.push(["Tickets por prioridad"]);
    Object.entries(stats.tickets_por_prioridad).forEach(([p, count]) => {
      rows.push([p, count]);
    });
    rows.push([]);
  }

  if (stats?.rendimiento_tecnicos?.length > 0) {
    rows.push(["Rendimiento de técnicos"]);
    rows.push(["Técnico", "Asignados", "Resueltos"]);
    stats.rendimiento_tecnicos.forEach((t) => {
      rows.push([t.nombre, t.tickets_asignados, t.tickets_resueltos]);
    });
  }

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPDF(stats) {
  const doc = new jsPDF();
  const fecha = new Date().toLocaleString();

  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text("Reporte de Tickets", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${fecha}`, 14, 25);

  let y = 34;

  autoTable(doc, {
    startY: y,
    head: [["Resumen", ""]],
    body: [
      ["Total tickets", String(stats?.total_tickets || 0)],
      ["Abiertos", String(stats?.tickets_abiertos || 0)],
      ["Cerrados", String(stats?.tickets_cerrados || 0)],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable.finalY + 10;

  if (tieneDatos(stats?.tickets_por_estado)) {
    autoTable(doc, {
      startY: y,
      head: [["Estado", "Cantidad"]],
      body: Object.entries(stats.tickets_por_estado).map(
        ([estado, count]) => [estado.replace("_", " "), String(count)],
      ),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (tieneDatos(stats?.tickets_por_prioridad)) {
    autoTable(doc, {
      startY: y,
      head: [["Prioridad", "Cantidad"]],
      body: Object.entries(stats.tickets_por_prioridad).map(([p, count]) => [
        p,
        String(count),
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  if (stats?.rendimiento_tecnicos?.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Técnico", "Asignados", "Resueltos"]],
      body: stats.rendimiento_tecnicos.map((t) => [
        t.nombre,
        String(t.tickets_asignados),
        String(t.tickets_resueltos),
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save(`reporte-tickets-${new Date().toISOString().slice(0, 10)}.pdf`);
}
