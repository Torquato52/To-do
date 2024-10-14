const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
    createUser: (username, passwordHash, callback) => {
        try{
        const query = 'INSERT INTO Users (username, password) VALUES (?, ?)';
        db.query(query, [username, passwordHash], callback);
        }catch(error){
            throw error;
        }
    },
    findUser: async (username) => {
        try {
            const query = 'SELECT * FROM Users WHERE username = ?';
            const [results] = await db.query(query, [username]);
            const user = results.length > 0 ? results[0] : null;
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    validatePassword: (inputPassword, hashedPassword) => {
        return bcrypt.compareSync(inputPassword, hashedPassword);
    },
};

module.exports = UserModel;
