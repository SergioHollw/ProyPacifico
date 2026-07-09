import { createContext, useContext, useState, useEffect, useCallback } from "react";

const RouterContext = createContext(null);

function matchPath(pattern, pathname) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.history.replaceState(null, "", to);
    } else {
      window.history.pushState(null, "", to);
    }
    setPath(window.location.pathname);
  }, []);

  const value = { path, navigate };
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  const childrenArray = Array.isArray(children) ? children : [children];
  for (const child of childrenArray) {
    if (!child) continue;
    const { path: pattern, element, index } = child.props || {};
    const fullPattern = index ? "/" : pattern || "/";
    const params = matchPath(fullPattern, path);
    if (params) {
      return <RouteContext.Provider value={{ params }}>{element}</RouteContext.Provider>;
    }
  }
  return null;
}

const RouteContext = createContext({ params: {} });

export function Route({ element }) {
  return element;
}

export function Link({ to, children, className, style, onClick, ...rest }) {
  const { navigate } = useContext(RouterContext);
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };
  return <a href={to} onClick={handleClick} className={className} style={style} {...rest}>{children}</a>;
}

export function NavLink({ to, children, className, style: customStyle, activeClassName, activeOnPaths, ...rest }) {
  const { path, navigate } = useContext(RouterContext);
  const isActive = path === to || (activeOnPaths && activeOnPaths.some((p) => path === p || (p !== "/" && path.startsWith(p + "/"))));
  const resolvedClass = typeof className === "function" ? className({ isActive }) : className;
  const combinedClass = [resolvedClass, isActive ? (activeClassName || "active") : ""].filter(Boolean).join(" ");
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handleClick} className={combinedClass} style={customStyle} {...rest}>{children}</a>;
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useParams() {
  const { params } = useContext(RouteContext);
  return params;
}

export function Navigate({ to, replace = true }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => { navigate(to, { replace }); }, [navigate, to, replace]);
  return null;
}

export function useLocation() {
  const { path } = useContext(RouterContext);
  return { pathname: path, search: window.location.search, hash: window.location.hash };
}
