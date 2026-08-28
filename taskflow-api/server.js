const express = require('express');
const app = express();
const PORTA = 3000;

app.use(express.json()); // middleware — antes das rotas

let tarefas = [ // let para poder reatribuir no DELETE
{ id:1, texto:'Estudar Node', prioridade:'alta', coluna:'afazer' },
{ id:2, texto:'Criar API', prioridade:'alta', coluna:'andamento' },
{ id:3, texto:'Testar Postman', prioridade:'media', coluna:'concluido' },
];

let proximoId = 4;

app.get('/', (req, res) => res.json({ api:'TaskFlow', status:'online' }));
app.get('/tarefas', (req, res) => res.json(tarefas));
app.get('/tarefas/:id', (req, res) => {

const tarefa = tarefas.find(t => t.id === Number(req.params.id));

if (!tarefa) return res.status(404).json({ erro: 'Não encontrada' });
res.json(tarefa);
});

app.post('/tarefas', (req, res) => {
const nova = { id: proximoId++, ...req.body };
tarefas.push(nova);
res.status(201).json(nova);
});

app.put('/tarefas/:id', (req, res) => {
const id = Number(req.params.id);
const idx = tarefas.findIndex(t => t.id === id);
if (idx === -1) return res.status(404).json({ erro: 'Não encontrada' });
tarefas[idx] = { id, ...req.body };
res.json(tarefas[idx]);
});

app.delete('/tarefas/:id', (req, res) => {
const id = Number(req.params.id);
if (!tarefas.find(t => t.id === id)) return res.status(404).json({ erro: 'Não encontrada' });
tarefas = tarefas.filter(t => t.id !== id);
res.json({ mensagem: 'Removida', id });
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.listen(PORTA, () => console.log(`Porta ${PORTA}`));