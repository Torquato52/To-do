require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
};

const connectToDatabase = async () => {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;
    }
};

module.exports = { connectToDatabase };
