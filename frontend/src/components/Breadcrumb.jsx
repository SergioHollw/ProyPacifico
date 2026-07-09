import { Link } from "../utils/router";
import "../styles/Breadcrumb.css";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb-nav">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-sep">/</span>}
          {item.to ? (
            <Link to={item.to} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
