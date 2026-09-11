function validarContentType(req, res, next) {
    const metodoComBody = ['POST', 'PUT', 'PATCH'];

    if (metodosComBody.includes(req.method)) {
        const contentType = req.headers['content-type'];
    
    if (!contentType || ! contentType.includes('application/json')) {
        return res.status(415).json({
            erro: 'content-Type inválido. Use: application/json'
         });
      }
    }
    next();
}
module.exports = validarContentType;