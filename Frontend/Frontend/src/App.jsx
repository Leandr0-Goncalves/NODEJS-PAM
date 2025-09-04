import { Routes, Route, Link } from "react-router-dom";
import Crud from "./pages/Crud";
import Form from "./pages/Form";

export default function App() {
  return (
    <div className="app">
      <header className="nav">
        <Link to="/">Registros</Link>
        <Link to="/novo">+ Novo</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Crud />} />
          <Route path="/novo" element={<Form />} />
          <Route path="/editar/:id" element={<Form />} />
        </Routes>
      </main>
    </div>
  );
}
