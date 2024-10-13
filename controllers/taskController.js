const TaskModel = require('../models/taskModel');
const redisClient = require('../config/redisConfig');

const TaskController = {
    registerTask: async (req, res) => {
        const { name, description} = req.body;
        const idUser = req.user.id;
        try {
            if (!name || !description || !idUser) {
                return res.status(400).send('Nome e descrição são de preenchimento obrigatório.');
            }
            await TaskModel.createTask(name, description, idUser);
            const tasks = await TaskModel.getAllTasks(idUser);
            console.log('Tarefa criada. Todas as tarefas:', tasks);
            await redisClient.setEx('tasks', 3600, JSON.stringify(tasks));
            res.status(201).json({ mensagem: 'Tarefa criada com sucesso.' });
        } catch (error) {
            console.error('Erro ao registrar tarefa:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }     
    },
    
    listTask: async (req, res) => {
        const idUser = req.user.id;
        console.log('idUser obtido do token:', idUser); 
        const cacheKey = `tasks_${idUser}`;
        try {
            const tasks = await TaskModel.getAllTasks(idUser);
            console.log('Tarefas obtidas do banco de dados:', tasks);
            if (!tasks || tasks.length === 0) {
                return res.json([]);
            }
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));
            console.log('Tarefas armazenadas no cache:', tasks);
            res.json(tasks);
        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            res.status(500).json({ mensagem: error.message });
        }
    },

    deleteTask: async (req, res) => {
        const { id } = req.params;
        const idUser = req.user.id;
        try {
            const result = await TaskModel.delTask(id, idUser);
            if (result.status === 200) {
                await redisClient.setEx(`tasks_${idUser}`, 3600, JSON.stringify(result));
            }
            return res.status(result.status).json({ mensagem: result.mensagem });
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            return res.status(500).json({ mensagem: error.message });
        }
    }
};

module.exports = TaskController; 