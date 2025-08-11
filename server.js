// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Caminho para o arquivo hidrantes.txt
const filePath = path.join(__dirname, 'hidrantes.txt');

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Servir arquivos HTML, CSS, JS

// Salvar hidrante
app.post('/salvar', (req, res) => {
    const { idNumber, location, status, date } = req.body;
    const linha = `${idNumber}|${location}|${status}|${date}\n`;

    fs.appendFile(filePath, linha, (err) => {
        if (err) return res.status(500).send('Erro ao salvar');
        res.send('Hidrante salvo com sucesso');
    });
});

// Listar hidrantes
app.get('/listar', (req, res) => {
    if (!fs.existsSync(filePath)) return res.json([]);
    const conteudo = fs.readFileSync(filePath, 'utf8').trim();
    if (!conteudo) return res.json([]);

    const linhas = conteudo.split('\n').map(l => {
        const [idNumber, location, status, date] = l.split('|');
        return { idNumber, location, status, date };
    });
    res.json(linhas);
});

// Excluir hidrante pelo índice
app.delete('/excluir/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (!fs.existsSync(filePath)) return res.status(404).send('Arquivo não encontrado');

    let linhas = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    if (index < 0 || index >= linhas.length) return res.status(400).send('Índice inválido');

    linhas.splice(index, 1);
    fs.writeFileSync(filePath, linhas.join('\n') + (linhas.length > 0 ? '\n' : ''), 'utf8');

    res.send('Hidrante excluído com sucesso');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
