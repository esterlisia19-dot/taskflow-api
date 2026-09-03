let tarefas = [
{ id: 1, texto: 'Estudar Node.js', prioridade: 'alta', coluna: 'andamento' },
{ id: 2, texto: 'Fazer exercícios', prioridade: 'media', coluna: 'afazer' },
];
let proximoId = 3;
module.exports = {
listar: () => tarefas,
listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),
buscar: (id) => tarefas.find(t => t.id === id),
adicionar: ({ texto, prioridade, coluna }) => {
const nova = { id: proximoId++, texto,
prioridade: prioridade || 'media',
coluna: coluna || 'afazer' };
tarefas.push(nova);
return nova;
},
atualizar: (id, dados) => {
const idx = tarefas.findIndex(t => t.id === id);
if (idx === -1) return null;
tarefas[idx] = { ...tarefas[idx], ...dados, id };
return tarefas[idx];
},
remover: (id) => {
const idx = tarefas.findIndex(t => t.id === id);
if (idx === -1) return null;
return tarefas.splice(idx, 1)[0];
},
};