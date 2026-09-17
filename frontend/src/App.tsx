import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Home } from "./pages/Home";
import { Entender } from "./pages/Entender";
import { Cuidar } from "./pages/Cuidar";
import { Proteger } from "./pages/Proteger";
import { ContentDetail } from "./pages/ContentDetail";
import { BuscarAjuda } from "./pages/BuscarAjuda";
import { Vozes } from "./pages/Vozes";
import { StoryDetail } from "./pages/StoryDetail";
import { Dados } from "./pages/Dados";
import { Educacao } from "./pages/Educacao";
import { ComoAjudar } from "./pages/ComoAjudar";
import { Nina } from "./pages/Nina";
import { Busca } from "./pages/Busca";
import { Quiz } from "./pages/Quiz";
import { NotFound } from "./pages/NotFound";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminContents } from "./pages/admin/AdminContents";
import { AdminStories } from "./pages/admin/AdminStories";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminReports } from "./pages/admin/AdminReports";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/entender" element={<Entender />} />
        <Route path="/cuidar" element={<Cuidar />} />
        <Route path="/proteger" element={<Proteger />} />
        <Route path="/conteudo/:slug" element={<ContentDetail />} />
        <Route path="/buscar-ajuda" element={<BuscarAjuda />} />
        <Route path="/vozes" element={<Vozes />} />
        <Route path="/vozes/:id" element={<StoryDetail />} />
        <Route path="/dados" element={<Dados />} />
        <Route path="/educacao" element={<Educacao />} />
        <Route path="/como-ajudar" element={<ComoAjudar />} />
        <Route path="/nina" element={<Nina />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/quiz/:slug" element={<Quiz />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="conteudos" element={<AdminContents />} />
        <Route path="historias" element={<AdminStories />} />
        <Route path="servicos" element={<AdminServices />} />
        <Route path="relatos" element={<AdminReports />} />
      </Route>
    </Routes>
  );
}
