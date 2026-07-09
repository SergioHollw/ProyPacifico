import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  abierto: "#16a34a",
  en_proceso: "#2563eb",
  cerrado: "#dc2626",
  pendiente: "#f59e0b",
  cancelado: "#6b7280",
};

const FALLBACK_COLORS = ["#2563eb", "#f59e0b", "#16a34a", "#dc2626", "#6b7280"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        fontSize: 13,
      }}
    >
      <strong style={{ textTransform: "capitalize" }}>{item.name}</strong>
      <div style={{ color: "#64748b" }}>{item.value} tickets</div>
    </div>
  );
}

// Etiqueta de porcentaje dentro de cada porción (sin línea conectora)
function renderInsideLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null; // evita amontonar texto en porciones muy chicas
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function EstadoChart({ estados }) {
  if (!estados) return null;

  const data = Object.entries(estados).map(([key, value]) => ({
    key,
    name: key.replace("_", " "),
    value,
    color: COLORS[key],
  }));

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-secondary)" }}>
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            paddingAngle={3}
            cornerRadius={6}
            dataKey="value"
            labelLine={false}
            label={renderInsideLabel}
            isAnimationActive={true}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.key}
                fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Total en el centro del donut */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{total}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>tickets</div>
      </div>

      {/* Leyenda propia */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 18px",
          marginTop: 12,
        }}
      >
        {data.map((entry, index) => (
          <div key={entry.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12.5, color: "#475569", textTransform: "capitalize" }}>
              {entry.name}
            </span>
            <span style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 600 }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}