const db = require('../config/db');

const TaskModel = {
    createTask: async (name, description, idUser) => {
        const status = 'pendente';
        const query = 'INSERT INTO Tasks (name, description, status, idUser) VALUES (?, ?, ?, ?)';
        console.log('Criando tarefa com os seguintes dados:');
        console.log('Nome:', name);
        console.log('Descrição:', description);
        console.log('Status:', status);
        console.log('ID do Usuário:', idUser);
        
        try {
            const [results] = await db.query(query, [name, description, status, idUser]);
            console.log('Tarefa inserida com sucesso:', results.insertId);
            return results.insertId;
        } catch (error) {
            console.error('Erro ao inserir a tarefa:', error);
            throw new Error('Erro ao criar a tarefa.');
        }
    },
    getAllTasks: async (idUser) => {
        const query = 'SELECT * FROM Tasks WHERE idUser = ?';
        try {
            const [results] = await db.query(query, [idUser]);
            return results;
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            throw new Error('Erro ao buscar tarefas.');
        }
    },

    delTask: async (id, idUser) => {
        const taskQuery = 'SELECT * FROM Tasks WHERE id = ? AND idUser = ?';
        const deleteQuery = 'DELETE FROM Tasks WHERE id = ? AND idUser = ?';
        try {
            const [task] = await db.query(taskQuery, [id, idUser]);
            if (!task || task.length === 0) {
                return { mensagem: 'Tarefa não encontrada ou você não tem permissão para deletá-la.', status: 404 };
            }
            const [result] = await db.query(deleteQuery, [id, idUser]);
            if (result.affectedRows > 0) {
                const tasks = await TaskModel.getAllTasks(idUser);
                await redisClient.setEx(`tasks_${idUser}`, 3600, JSON.stringify(tasks));
                return { mensagem: 'Tarefa deletada com sucesso.', status: 200, tasks };
            } else {
                return { mensagem: 'Tarefa não encontrada.', status: 404 };
            }
        } catch (error) {
            throw new Error('Erro ao deletar a tarefa: ' + error.message);
        }
    },
    
};

module.exports = TaskModel;