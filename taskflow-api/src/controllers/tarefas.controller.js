/*let tarefas = [];
let proximoId = 1;
const tarefasController = {*/
const tarefaModel = require('../models/tarefa.model');
const usuarioModel = require('../models/usuario.model');
const projetoModel = require('../models/projeto.model');

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
  const {texto, prioridade, coluna, usuarioId, projetoId} = req.body;

  if (!texto) return res.status(400).json({ erro: 'Texto obrigatório' });

  if (prioridade !== undefined && !['alta', 'media', 'baixa'] .includes
      (prioridade) ) {
       return res.status(400).json({
        erro:'Prioridade inválida. Use: alta, media ou baixa.'
       });
      }

      if ( coluna !== undefined && !['afazer', 'andamento', 'concluido']
        .includes(coluna) ) {
          return res.status(400).json({
            erro: 'Coluna inválida. Use: afazer, andamento, concluido'
          });
        }
      if (usuarioId !== undefined) { const usuario = 
        usuarioModel.buscar( parseInt(usuarioId)
      );
      if (!usuario) {return res.status(400).json({
        erro:'Usuario não encontrado'
      });
    }
  }
      if(projetoId !== undefined) { const projeto = 
        projetoModel.buscar(
          parseInt(projetoId)
        );
      if (!projeto) {
        return res.status(400).json({
          erro: 'Projeto não encontrado'
        });
      }
    }
        
        const colunaFinal = coluna || 'afazer';
        if( colunaFinal === 'andamento' && usuarioId !== undefined
        ) {
          const idUsuario = parseInt(usuarioId);
          const tarefasEmAndamento = tarefaModel 
          .listar() 
          .filter(t => t.usuarioId == idUsuario
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
    usuarioId:
      usuarioId !== undefined ? parseInt (usuarioId) :undefined,
    projetoId:
      projetoId !== undefined ? parseInt (projetoId) :undefined, 
  }); 
  res.status(201).json(nova);
 },
  

atualizar(req, res) {
 const id = parseInt(req.params.id);
 const tarefaAtual = tarefaModel.buscar(id) 
 if (!tarefaAtual) { 
  return res.status(404).json({ erro: 'Tarefa não encontrada' });
 }
 const {
  prioridade,
  coluna,
  usuarioId,
  concluidaEm
 } = req.body;
 if (concluidaEm !== undefined) {return res.status(400).json({
  erro: 'ConcluidaEm é gerada automaticamente.'
 });}
 if (prioridade !== undefined &&
   !['alta', 'media', 'baixa'].includes(prioridade) ) {
    return res.status(400).jsn({
      erro:'Prioridade invalida. Use: alta, media ou baixa'
    });
   }
if ( coluna !== undefined && 
!['afazer', 'andamento', 'concluido'].includes(coluna)
) {
  return res.status(400).json({ 
    erro: 'Coluna inválida. Use: afazer, andamento ou concluido'});
}
const colunaFinal =
 coluna !== undefined 
 ? coluna 
 : tarefaAtual.coluna;

const usuarioFinal = 
usuarioId !== undefined
  ? parseInt(usuarioId)
  : tarefaAtual.usuarioId;

if (usuarioId !== undefined) {
   const usuario =
 usuarioModel.buscar(usuarioFinal);

if (!usuario) {
  return res.status(400).json({ erro:'Usuario não encontrado'});
  }
}
if ( 
  colunaFinal === 'andamento' && usuarioFinal !== undefined &&
  ( tarefaAtual.coluna !== 'andamento' || tarefaAtual.usuarioId
    !== usuarioFinal
  )
) { const tarefasEmAndamento = tarefaModel .listar() .filter(
  t => t.id !== id && t.usuarioId === usuarioFinal &&
  t.coluna === 'andamento');
  if (tarefasEmAndamento.length >= 2) {
    return 
res.status(400).json({ erro:'Limite de 2 tarefas em andamento por usuario atingido'
  });
  }
}
const dados = { ...req.body };
delete dados.concluidaEm;
if (
  colunaFinal === 'concluido' && tarefaAtual.coluna !== 'concluido' ) {
    dados.concluidaEm = new Date(). toISOString();
  }
if ( colunaFinal === 'concluido' && tarefaAtual.coluna === 'concluido')
{dados.concluidaEm = null;}
if (usuarioId !== undefined) {dados.usuarioId = usuarioFinal;}
const atualizado = tarefaModel.atualizar( id, dados);
res.json(atualizado);
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
  let tarefas = tarefaModel.listar();

if(coluna) { tarefas = tarefas.filter(
    t => t.coluna === coluna
  ); 
}
 const porColuna = { 
  afazer: tarefas.filter( t => t.coluna === 'afazer').length,
  andamento: tarefas.filter( t => t.coluna === 'andamento').length,
  concluido: tarefas.filter( t => t.coluna === 'concluido').length,
 };
 const usuarios = usuariosModel.listar();

 const rankingUsuarios = usuarios
    .map(usuario => ({
      usuarioId: usuario.id,
      nome: usuario.nome,
      totalTarefas: 
      tarefas.filter( t => t.usuarioId === usuario.id).length
    })) 
    .sort( (a, b) => b.totalTarefas - a.totalTarefas);
    res.json({
      total:tarefas.length,
      porColuna,
      rankingUsuarios
    });
  },



module.exports = tarefasController;