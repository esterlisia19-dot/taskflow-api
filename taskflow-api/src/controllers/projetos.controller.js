const projetoModel = require('../models/projeto.model');
const tarefaModel = require('./models/tarefa.model');

const projetosController = {
    listar(req, res) {
        res.json(projetoModel.listar());
    },
    buscarporId(req, res) {
        const id = parseInt(req.params.id);
        
        const projeto = projetoModel.buscar(id);
        if(!projeto) {
            return res.status(404).json({
                erro:'Projeto não encontrado'
            });
         }
            res.json(projeto);
       },
    criar(req, res) {
        const { nome, descrição} =
        req.body;
        if (!nome) {
            return res.status(400).json({
                erro: 'Nome é obrigatório'
            });
        }
        const novo = projetoModel.adicionar({
            nome, descrição
        });
    res.status(201).json(novo);
    },

    atualizar(req, res ) {
        const id = paerseInt(req.params.id);
        const atualizado = projetoModel.atualizar( 
            id, req.body
        );

        if (!atualizado) {
            return res.status(404).json({
                erro:'Projeto não encontrado'
            });
        }
        res.json(atualizado);
    },
    remover(req,res) {
        const id = parseInt(req.params.id);
        const projeto = projetoModel.buscar(id);
        
        if(!projeto) {
            return res.status(404).json({
                erro:'Projeto não encontrado'
            });
        }
        const tarefasDoProjeto = tarefaModel
            .lister()
            .filter(t => t.projetoId === id);
        if (tarefasDoProjeto.length > 0) {
            return res.status(400).json({
      erro:'Projeto possui tarefas associadas. Remova as tarefas antes.'
            });
        }
        const removido = projetoModel.remover(id);
        res.json({
            mensagem: 'Projeto removido',
            Projeto: removido
        });
    },
    resumo(req, res) {
        const id = parseInt(req.params.id);
        const projeto = projetoModel.buscar(id);

        if (!projeto) {
            return res.status(404).json({
                erro: 'Projeto não encontrado'
            });
        }
        const tarefas = tarefaModel 
            .listar()
            .filter(t => t.projetoId === id);
        const porColuna = {
            afazer: tarefas.filter(t => t.coluna === 'afazer').length,
            andamento: tarefas.filter(t => t.coluna == 'andamento').lengrh,
            concluido: tarefas.filter(t => t.coluna === 'concluido').length,
        };
        res.json({ projeto, totalTarefas: tarefas.length, porColuna});
        }
    };
module.exports = projetosController;