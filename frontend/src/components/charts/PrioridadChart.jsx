import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import { PRIORITY_COLORS_HEX } from "../../utils/constants";

const FALLBACK = "#2563eb";

function CustomTooltip({ active, payload, label }) {
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
      <strong style={{ textTransform: "capitalize" }}>{label}</strong>
      <div style={{ color: "#64748b" }}>{item.value} tickets</div>
    </div>
  );
}

function CustomizedTick({ x, y, payload }) {
  return (
    <text
      x={x}
      y={y + 14}
      textAnchor="middle"
      fontSize={12.5}
      fill="#475569"
      style={{ textTransform: "capitalize" }}
    >
      {payload.value.replace("_", " ")}
    </text>
  );
}

export default function PrioridadChart({ prioridades }) {
  if (!prioridades) return null;

  const data = Object.entries(prioridades).map(([name, value]) => ({
    name,
    cantidad: value,
    color: PRIORITY_COLORS_HEX[name.toLowerCase()] || FALLBACK,
  }));

  const total = data.reduce((acc, d) => acc + d.cantidad, 0);

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-secondary)" }}>
        Sin datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        barCategoryGap={28}
      >
        <defs>
          {data.map((entry) => (
            <linearGradient
              key={entry.name}
              id={`grad-${entry.name}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
              <stop offset="100%" stopColor={entry.color} stopOpacity={0.65} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#e2e8f0" />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={<CustomizedTick />}
        />

        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          width={30}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,.08)" }} />

        <Bar
          dataKey="cantidad"
          radius={[8, 8, 0, 0]}
          maxBarSize={56}
          animationDuration={800}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={`url(#grad-${entry.name})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}