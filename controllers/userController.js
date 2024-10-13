const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const { generateToken } = require('../config/jwt'); 

const UserController = {
    registerUser: async (req, res) => {
        const { user, password } = req.body;
        try {
            const existingUser = await UserModel.findUser(user);
            if (!user || !password) {
                return res.status(400).json('Usuário e senha são obrigatórios.');;
            }
            if (existingUser) {
                return res.status(409).json({ mensagem: 'Usuário já cadastrado.' });
            }
            const senhaHash = bcrypt.hashSync(password, 10);
            await UserModel.createUser(user, senhaHash);
            res.status(200).json({ message: 'Inserido com sucesso.' });
        } catch (error) {
                console.error('Erro ao criar usuário:', error);
                res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
        }
    },
    loginUser: async (req, res) => {
        const { user, password } = req.body;
        try {
            if (!user || !password) {
                return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
            }
            const userData = await UserModel.findUser(user);
            if (!userData) {
                return res.status(401).json({ message: 'Usuário ou Senha inválidos.' });
            }
            const isPasswordValid = UserModel.validatePassword(password, userData.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Usuário ou Senha inválidos.' });
            }
            const token = generateToken(userData.id);
            res.status(200).json({ message: 'Login bem-sucedido.', token });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Deu algo errado.' });
        }
    },
    
};

module.exports = UserController;