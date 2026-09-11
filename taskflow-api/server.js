app.use(express.json()); 
app.use(validarContentType);
app.use(logger);

app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/projetos', projetosRoutes);

const express = require('express');
const tarefasRoutes = require('./src/routes/tarefas.routes');
const app = express();
const PORTA = 3000;


app.use((req, res) => {
res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORTA, () => {
console.log(`Servidor rodando em
http://localhost:${PORTA}`);
});
