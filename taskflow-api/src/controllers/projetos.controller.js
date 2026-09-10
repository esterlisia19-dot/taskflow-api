const projetoModel = require('../models/projeto.model');
const tarefaModel = require('./models/tarefa.model');

const projetosController = {
    listar(req, res) {
        res.json(projetoModel.listar());
    },
    buscarporId(req, res) {
        const id = parseInt(req.params.id);
        
        const projeto = projetoModel.buscar(id);


    }
}