const TaskModel = require('../models/taskModel')

const TaskController = {
    registerTask: async (req, res) => {
        const { name, description, idUser } = req.body;
        try {
            if (!name || !description || !idUser) {
                return res.status(400).send('Nome, descrição e idUser são obrigatórios.');
            }
            await TaskModel.createTask(name, description, idUser);
            res.status(201).send('Tarefa criada com sucesso.'); 
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            res.status(500).send('Erro interno do servidor.');
        }
    // listTask: async (req, res) => {
        
    // }

    // deleteTask: async (req, res) => {
    //     const {id} = req.params;
    //     try{
    //         await TaskModel.delTask(id);
    //         res.status(200).json({ message: 'Tarefa deletada.' });
    //     }catch(error){
    //     res.status(500).json({ mensagem: 'Erro ao deletar tarefa.' }); 
    //     }
    // }
     }
}

module.exports = TaskController;