let projetos = [];

let proximoId = 1;

const projetosController = {

listar(req, res) {

res.json(projetos);

},

buscarPorId(req, res) {

const p = projetos.find(p => p.id === parseInt(req.params.id));

if (!p) return res.status(404).json({ erro: 'Projeto não encontrado' });

res.json(p);

},

criar(req, res) {

const { nome, descricao } = req.body;

if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

const novo = { id: proximoId++, nome, descricao: descricao || null };

projetos.push(novo);

res.status(201).json(novo);

},
atualizar(req, res) {
const atualizado = projetoModel.atualizar(parseInt(req.params.id), req.body);
if (!atualizado) return res.status(404).json({ erro: 'Projeto não encontrado'
});
res.json(atualizado);
},
remover(req, res) {
const removido = projetoModel.remover(parseInt(req.params.id));
if (!removido) return res.status(404).json({ erro: 'Projeto não encontrado' });
res.json({ mensagem: 'Projeto removido', projeto: removido });
},
};
module.exports = projetosController;