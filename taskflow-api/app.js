const somar = require('./calcular');

console.log(somar(2, 3));
console.log(somar(10, 7)); 


const tarefasUtils = require('./utils/tarefas');
const { listarTodas, adicionar } = require('./utils/tarefas');
adicionar({ id: 1, texto: 'Estudar Node', coluna: 'afazer' });
console.log(listarTodas()); 

