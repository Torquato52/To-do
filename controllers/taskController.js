const TaskModel = require('../models/taskModel');
const redisClient = require('../config/redisConfig');

const TaskController = {
    registerTask: async (req, res) => {
        const { name, description } = req.body;
        const idUser = req.user.id;
        try {
            if (!name || !description || !idUser) {
                return res.status(400).send('Nome e descrição são de preenchimento obrigatório.');
            }

            const taskId = await TaskModel.createTask(name, description, idUser);
            const tasks = await TaskModel.getAllTasks(idUser);

            await redisClient.setEx(`tasks_${idUser}`, 3600, JSON.stringify(tasks));
            res.status(201).json({ mensagem: 'Tarefa criada com sucesso.', taskId });
        } catch (error) {
            console.error('Erro ao registrar tarefa:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    },

    listTask: async (req, res) => {
        const idUser = req.user.id;
        const cacheKey = `tasks_${idUser}`;
        try {
            const tasks = await TaskModel.getAllTasks(idUser);
            if (!tasks || tasks.length === 0) {
                return res.json([]);
            }

            await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));
            res.json(tasks);
        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    },

    deleteTask: async (req, res) => {
        const { id } = req.params;
        const idUser = req.user.id;
        try {
            const result = await TaskModel.delTask(id, idUser);
            if (result.status === 200) {
                const tasks = result.tasks;
                await redisClient.setEx(`tasks_${idUser}`, 3600, JSON.stringify(tasks));
            }
            return res.status(result.status).json({ mensagem: result.mensagem });
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    },

    updateTaskStatus: async (req, res) => {
        const { id } = req.params;
        const idUser = req.user.id;
        const newStatus = 'Concluída';
        try {
            const result = await TaskModel.updateStatusTask(id, idUser, newStatus);
            if (result.status === 200) {
                res.status(200).json({ mensagem: result.mensagem, tasks: result.tasks });
            } else {
                res.status(result.status).json({ mensagem: result.mensagem });
            }
        } catch (error) {
            console.error('Erro ao atualizar o status da tarefa:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    },

    updateTask: async (req, res) => {
        const { name, description, status } = req.body;
        const idUser = req.user.id;
        const taskId = req.params.id;

        try {
            if (!name || !description) {
                return res.status(400).send('Nome e descrição são obrigatórios.');
            }

            const result = await TaskModel.updateTask(taskId, name, description, status, idUser);
            if (result.rowsAffected[0] > 0) {
                return res.status(200).json({ mensagem: 'Tarefa atualizada com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.' });
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }
};

module.exports = TaskController;