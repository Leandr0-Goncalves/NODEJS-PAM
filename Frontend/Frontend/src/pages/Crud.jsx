import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Crud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/items"); // usamos /api por causa do proxy
      const data = await res.json();
      setItems(data);
    } catch (err) {
      alert("Erro ao carregar: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Deseja excluir este registro?")) return;
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      alert("Erro ao excluir: " + err);
    }
  }

  return (
    <div>
      <h2>Registros</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          {items.length === 0 && <p>Nenhum registro</p>}
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <br />
                <small>{item.description}</small>
                <br />
                <Link to={`/editar/${item.id}`}>Editar</Link> {" | "}
                <button onClick={() => handleDelete(item.id)}>Apagar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
