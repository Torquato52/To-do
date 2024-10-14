const { connectToDatabase } = require('../config/db');
const redisClient = require('../config/redisConfig');
const sql = require('mssql');

const TaskModel = {
    createTask: async (name, description, idUser) => {
        const query = `
            INSERT INTO Tasks (name, description, idUser, status)
            OUTPUT inserted.id
            VALUES (@name, @description, @idUser, 'Pendente');
        `;
    
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('name', sql.NVarChar, name)
                .input('description', sql.NVarChar, description)
                .input('idUser', sql.Int, idUser)
                .query(query);
    
            if (result && result.recordset && result.recordset.length > 0) {
                return result.recordset[0].id;
            } else {
                throw new Error('Erro ao criar a tarefa: Nenhum ID foi retornado.');
            }
        } catch (error) {
            throw new Error('Erro ao criar a tarefa: ' + error.message);
        }
    },

    getAllTasks: async (idUser) => {
        const query = 'SELECT * FROM Tasks WHERE idUser = @idUser';
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('idUser', sql.Int, idUser)
                .query(query);
            return result.recordset;
        } catch (error) {
            throw new Error('Erro ao buscar tarefas: ' + error.message);
        }
    },

    delTask: async (id, idUser) => {
        const taskQuery = 'SELECT * FROM Tasks WHERE id = @id AND idUser = @idUser';
        const deleteQuery = 'DELETE FROM Tasks WHERE id = @id AND idUser = @idUser';
        try {
            const pool = await connectToDatabase();
            const taskResult = await pool.request()
                .input('id', sql.Int, id)
                .input('idUser', sql.Int, idUser)
                .query(taskQuery);

            const task = taskResult.recordset;
            if (!task || task.length === 0) {
                return { mensagem: 'Tarefa não encontrada ou você não tem permissão para deletá-la.', status: 404 };
            }

            const deleteResult = await pool.request()
                .input('id', sql.Int, id)
                .input('idUser', sql.Int, idUser)
                .query(deleteQuery);

            if (deleteResult.rowsAffected[0] > 0) {
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
        const taskQuery = 'SELECT * FROM Tasks WHERE id = @id AND idUser = @idUser';
        const updateQuery = 'UPDATE Tasks SET status = @status WHERE id = @id AND idUser = @idUser';
        try {
            const pool = await connectToDatabase();
            const taskResult = await pool.request()
                .input('id', sql.Int, id)
                .input('idUser', sql.Int, idUser)
                .query(taskQuery);

            const task = taskResult.recordset;
            if (!task || task.length === 0) {
                return { mensagem: 'Tarefa não encontrada ou você não tem permissão para alterá-la.', status: 404 };
            }

            const updateResult = await pool.request()
                .input('status', sql.VarChar, newStatus)
                .input('id', sql.Int, id)
                .input('idUser', sql.Int, idUser)
                .query(updateQuery);

            if (updateResult.rowsAffected[0] > 0) {
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
        const query = 'UPDATE Tasks SET name = @name, description = @description, status = @status WHERE id = @id AND idUser = @idUser';
        try {
            const pool = await connectToDatabase();
            const result = await pool.request()
                .input('name', sql.VarChar, name)
                .input('description', sql.Text, description)
                .input('status', sql.VarChar, status)
                .input('id', sql.Int, id)
                .input('idUser', sql.Int, idUser)
                .query(query);

            if (result.rowsAffected[0] === 0) {
                throw new Error('Tarefa não encontrada ou você não tem permissão para atualizá-la.');
            }
            return result;
        } catch (error) {
            throw new Error('Erro ao atualizar a tarefa: ' + error.message);
        }
    }
};

module.exports = TaskModel;