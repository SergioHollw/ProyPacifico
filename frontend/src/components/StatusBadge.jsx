import { STATUS_BADGE_MAP } from "../utils/constants";

export default function StatusBadge({ estado }) {
  const className = STATUS_BADGE_MAP[estado] || "badge-open";

  return <span className={`badge ${className}`}>{estado}</span>;
}
