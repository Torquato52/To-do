const db = require('../config/db');
const redisClient = require('../config/redisConfig');

const TaskModel = {
    createTask: async (name, description, idUser) => {
        const status = 'pendente';
        const query = 'INSERT INTO Tasks (name, description, status, idUser) VALUES (?, ?, ?, ?)';
        try {
            const [results] = await db.query(query, [name, description, status, idUser]);
            return results.insertId;
        } catch (error) {
            throw new Error('Erro ao criar a tarefa.');
        }
    },
    getAllTasks: async (idUser) => {
        const query = 'SELECT * FROM Tasks WHERE idUser = ?';
        try {
            const [results] = await db.query(query, [idUser]);
            return results;
        } catch (error) {
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

    updateStatusTask: async (id, idUser, newStatus) => {
        const taskQuery = 'SELECT * FROM Tasks WHERE id = ? AND idUser = ?';
        const updateQuery = 'UPDATE Tasks SET status = ? WHERE id = ? AND idUser = ?';
        try {
            const [task] = await db.query(taskQuery, [id, idUser]);
            if (!task || task.length === 0) {
                return { mensagem: 'Tarefa não encontrada ou você não tem permissão para alterá-la.', status: 404 };
            }
            const [result] = await db.query(updateQuery, [newStatus, id, idUser]);
            if (result.affectedRows > 0) {
                const tasks = await TaskModel.getAllTasks(idUser);
                await redisClient.setEx(`tasks_${idUser}`, 3600, JSON.stringify(tasks));
                return { mensagem: 'Status da tarefa atualizado com sucesso.', status: 200, tasks };
            } else {
                return { mensagem: 'Tarefa não encontrada.', status: 404 };
            }
        } catch (error) {
            throw new Error('Erro ao atualizar o status da tarefa: ' + error.message);
        }
    },
    updateTask: async (id, name, description, status, idUser) => {
        const query = 'UPDATE Tasks SET name = ?, description = ?, status = ? WHERE id = ? AND idUser = ?';
        try {
            const [result] = await db.query(query, [name, description, status, id, idUser]);
            if (!result || result.affectedRows === 0) {
                throw new Error('Tarefa não encontrada ou você não tem permissão para atualizá-la.');
            }
            return result;  
        } catch (error) {
            throw new Error('Erro ao atualizar a tarefa: ' + error.message);
        }
    }
};

module.exports = TaskModel;