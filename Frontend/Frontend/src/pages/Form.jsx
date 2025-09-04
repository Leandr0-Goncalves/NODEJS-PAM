import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/items/${id}`)
        .then((r) => r.json())
        .then((data) =>
          setForm({
            name: data.name || "",
            description: data.description || "",
          })
        );
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    setSaving(true);
    try {
      if (id) {
        await fetch(`/api/items/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      navigate("/");
    } catch (err) {
      alert("Erro: " + err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>{id ? "Editar Registro" : "Novo Registro"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <br />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label>Descrição</label>
          <br />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
