require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

// CRUD de pacientes
app.get('/pacientes', (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM pacientes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

app.post('/pacientes', (req, res) => {
  const { nome, data_nascimento, genero, numero_carteirinha, data_primeira_consulta, cpf } = req.body;
  const sql = 'INSERT INTO pacientes (nome, data_nascimento, genero, numero_carteirinha, data_primeira_consulta, cpf) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, data_nascimento, genero, numero_carteirinha, data_primeira_consulta, cpf], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, genero, numero_carteirinha, data_primeira_consulta, cpf } = req.body;
  const sql = 'UPDATE pacientes SET nome = ?, data_nascimento = ?, genero = ?, numero_carteirinha = ?, data_primeira_consulta = ?, cpf = ? WHERE id = ?';
  db.query(sql, [nome, data_nascimento, genero, numero_carteirinha, data_primeira_consulta, cpf, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM pacientes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
