const db = require('../config/db');

const TaskModel = {
    createTask: (name, description, idUser, callback) => {
        const status = 'pendente';
        const query = 'INSERT INTO Tasks (name, description, status, idUser) VALUES (?, ?, ?, ?)';
        
        db.query(query, [name, description, status, idUser], (error, results) => {
            if (error) {
                console.error('Erro ao inserir a tarefa:', error);
                return callback(error);
            }
            console.log('Tarefa inserida com sucesso:', results.insertId);
            callback(null, results.insertId);
        });
    },

    // delTask: (id) => {
    //     const query = ('DELETE FROM Tasks WHERE id = ?', [taskId]);
        
    // }
};

module.exports = TaskModel;