const { connectToDatabase } = require('../config/db');
const bcrypt = require('bcrypt');
const sql = require('mssql');

const UserModel = {
    createUser: async (username, passwordHash) => {
        const pool = await connectToDatabase();
        try {
            const query = 'INSERT INTO [User] (username, password) VALUES (@username, @password)';
            const request = pool.request()
                .input('username', sql.VarChar, username)
                .input('password', sql.VarChar, passwordHash);
            await request.query(query);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        } finally {
            pool.close();
        }
    },

    findUser: async (username) => {
        const pool = await connectToDatabase();
        try {
            const query = 'SELECT * FROM [User] WHERE username = @username';
            const request = pool.request()
                .input('username', sql.VarChar, username);
            const result = await request.query(query);
            const user = result.recordset.length > 0 ? result.recordset[0] : null;
            return user;
        } catch (error) {
            console.error("Erro ao encontrar usuário:", error);
            throw new Error(error.message);
        } finally {
            pool.close();
        }
    },
    validatePassword: (inputPassword, hashedPassword) => {
        return bcrypt.compareSync(inputPassword, hashedPassword);
    },
};

module.exports = UserModel;
