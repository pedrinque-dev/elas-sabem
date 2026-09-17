import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function SiteLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
