import React, { useEffect, useMemo, useState } from "react";

// Ajuste aqui se o backend estiver rodando em outra origem/porta
const API_BASE = (typeof window !== 'undefined' && window.localStorage.getItem('apiBase')) || 'http://localhost:3000';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ Nome: "", Idade: "", UF: "" });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(c =>
      String(c.id || "").includes(q) ||
      String(c.Nome || "").toLowerCase().includes(q) ||
      String(c.UF || "").toLowerCase().includes(q) ||
      String(c.Idade || "").toLowerCase().includes(q)
    );
  }, [clientes, filter]);

  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/`, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`Falha ao buscar clientes: ${res.status}`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ Nome: "", Idade: "", UF: "" });
    setEditId(null);
  }

  async function createCliente(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, Idade: Number(form.Idade) };
      const res = await fetch(`${API_BASE}/clientes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao inserir');
      await fetchAll();
      resetForm();
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateCliente(e) {
    e.preventDefault();
    if (!editId) return;
    setError("");
    try {
      const payload = { ...form, Idade: Number(form.Idade) };
      const res = await fetch(`${API_BASE}/clientes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao atualizar');
      await fetchAll();
      resetForm();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remover(id) {
    if (!confirm(`Confirmar exclusão do cliente #${id}?`)) return;
    setError("");
    try {
      const res = await fetch(`${API_BASE}/clientes/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Erro ao deletar');
      await fetchAll();
    } catch (e) {
      setError(e.message);
    }
  }


  function editar(c) {
    setEditId(c.id);
    setForm({ Nome: c.Nome ?? "", Idade: String(c.Idade ?? ""), UF: c.UF ?? ""});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRUD de Clientes</h1>
        <div className="flex gap-2 items-center">
          <input
            className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring w-64"
            placeholder="Filtrar por id, nome, UF, idade..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button
            className="px-3 py-2 rounded-xl border hover:bg-gray-100"
            onClick={fetchAll}
            disabled={loading}
          >Recarregar</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">{editId ? `Editar cliente #${editId}` : 'Novo cliente'}</h2>
          <form onSubmit={editId ? updateCliente : createCliente} className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Nome</span>
              <input name="Nome" value={form.Nome} onChange={onChange} required className="border rounded-xl px-3 py-2 outline-none focus:ring" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Idade</span>
              <input name="Idade" type="number" min={0} value={form.Idade} onChange={onChange} required className="border rounded-xl px-3 py-2 outline-none focus:ring" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">UF</span>
              <input name="UF" maxLength={2} value={form.UF} onChange={onChange} required className="border rounded-xl px-3 py-2 uppercase outline-none focus:ring" />
            </label>
            <div className="flex gap-2 pt-2">
              <button className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50" disabled={loading}>
                {editId ? 'Salvar alterações' : 'Adicionar'}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-2xl border">Cancelar edição</button>
              )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
          <div className="mt-4 text-xs text-gray-500">
            <p>Base da API atual: <code className="px-1 py-0.5 bg-gray-100 rounded">{API_BASE}</code></p>
            <div className="flex gap-2 mt-2">
              <input id="apiBase" placeholder="http://localhost:3000" className="border rounded px-2 py-1 text-xs w-full" defaultValue={API_BASE} />
              <button className="px-3 py-1 rounded border" onClick={() => {
                const v = document.getElementById('apiBase').value.trim();
                localStorage.setItem('apiBase', v);
                window.location.reload();
              }}>Salvar base</button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Clientes ({filtered.length})</h2>
          </div>
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 border-b">ID</th>
                  <th className="text-left p-2 border-b">Nome</th>
                  <th className="text-left p-2 border-b">Idade</th>
                  <th className="text-left p-2 border-b">UF</th>
                  <th className="text-left p-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">Nenhum cliente encontrado.</td></tr>
                )}
                {!loading && filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{c.id}</td>
                    <td className="p-2 border-b">{c.Nome}</td>
                    <td className="p-2 border-b">{c.Idade}</td>
                    <td className="p-2 border-b">{c.UF}</td>
                    <td className="p-2 border-b">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-xl border" onClick={() => editar(c)}>Editar</button>
                        <button className="px-3 py-1 rounded-xl border" onClick={() => remover(c.id)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
