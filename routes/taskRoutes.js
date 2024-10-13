const express = require('express');
const TaskController = require('../controllers/taskController');
const { authenticateToken } = require('../config/jwt');

const router = express.Router();

router.post('/register', authenticateToken, TaskController.registerTask);
router.get('/list', authenticateToken, TaskController.listTask);
router.delete('/delete/:id', authenticateToken, TaskController.deleteTask);

module.exports = router;
