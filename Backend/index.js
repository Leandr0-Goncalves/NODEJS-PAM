const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const db = require('./conf/autenticacao.js');

const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // libera o CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Permite usar verbos HTTP extras (PUT/DELETE) via header/campo _method
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

// Rotas

// Listar todos
app.get('/', async (req, res) => {
  try {
    const results = await db.selectFull();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Buscar por ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.selectById(id);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// Inserir
app.post('/clientes', async (req, res) => {
  try {
    const { Nome, Idade, UF } = req.body;
    const results = await db.insertCliente(Nome, Idade, UF);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao inserir cliente' });
  }
});

// Atualizar
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Nome, Idade, UF } = req.body;
    const results = await db.updateCliente(Nome, Idade, UF, id);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Deletar
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.deleteById(id);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

// Start
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
