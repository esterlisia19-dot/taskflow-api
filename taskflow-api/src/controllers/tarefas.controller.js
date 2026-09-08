/*let tarefas = [];
let proximoId = 1;
const tarefasController = {*/
const tarefaModel = require('../models/tarefa.model');
const usuarioModel = require('../models/usuario.model');

const tarefasController = {

listar(req, res) {
  const { coluna, usuarioId } = req.query;
  let resultado = tarefaModel.listar();
  if (coluna) {
    resultado = resultado.filter(t => t.coluna === coluna);
}
if (usuarioId) {
  resultado = resultado.filter(t => t.usuarioId === Number(usuarioId));
}
  res.json(resultado);
},

buscarPorId(req, res) {
  const id = parseInt(req.params.id);
  const tarefa = tarefaModel.buscar(id);
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
  res.json(tarefa);
},

criar(req, res) {
  const { texto, prioridade, coluna, usuarioId } = req.body;
  if (!texto) return res.status(400).json({ erro: 'Texto obrigatório' });
  if (prioridade !== undefined && !['alta', 'media', 'baixa'] .includes
      (prioridade) ) {
       return res.status(400).json({
        erro:'Prioridade inválida. Use: alta, media ou baixa.'
       });
      }
      if ( 
        coluna !== undefined && !['afazer', 'andamento', 'concluido']
        .includes(coluna) ) {
          return res.status(400).json({
            erro: 'Coluna inválida. Use: afazer, andamento, concluido'
          });
        }
        const colunaFinal = coluna || 'afazer';
        if(
          colunaFinal === 'andamento' && usuarioId !== undefined
        ){
          const idUsuario = parseInt(usuarioId);
          const tarefasEmAndamento = tarefaModel 
          .listar() .filter(t => t.usuarioId == idUsuario
            && t.coluna === 'andamento');
      if (tarefasEmAndamento.length >= 2) {
        return res.status(400).json({
          erro: 'Limite de 2 tarefas em andamento por usuário atingido'
        });
      }
    }
       if (usuarioId !== undefined) {
    const usuario = usuarioModel.buscar(usuarioId);
     if (!usuario) {
      return
      res.status(400).json({erro: 'Usuário não encontrado'});
     }
  }
  const nova = tarefaModel.adicionar({
    texto,
    prioridade,
    coluna,
    usuarioId
  }); 
  res.status(201).json(nova); },
  /*{ id: proximoId++, texto,
   prioridade: prioridade || 'media',
   coluna: coluna || 'afazer' };
  tarefas.push(nova);
  res.status(201).json(nova);
},*/

atualizar(req, res) {
 const id = parseInt(req.params.id);
 const idx = tarefas.findIndex(t => t.id === id);
 if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });
 tarefas[idx] = { ...tarefas[idx], ...req.body, id };
 res.json(tarefas[idx]);
},

remover(req, res) {
  const id = parseInt(req.params.id);
  const removida = tarefaModel.remover(id);
  if (!removida) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  res.json({ mensagem: 'Tarefa removida', tarefa: removida });
},

estatisticas(req, res) {
  const { coluna } = req.query;
  const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;
  const porColuna = {
    afazer: base.filter(t=>t.coluna==='afazer').length,
    andamento: base.filter(t=>t.coluna==='andamento').length,
    concluido: base.filter(t=>t.coluna==='concluido').length,
   };
   res.json({ total: base.length, porColuna });

  },
};

module.exports = tarefasController;