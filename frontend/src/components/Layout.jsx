import Navbar from "./Navbar";

export default function Layout({ children, onLogout }) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <main>{children}</main>
    </>
  );
}
