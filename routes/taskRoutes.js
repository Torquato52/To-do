const express = require('express');
const TaskController = require('../controllers/taskController');
const { authenticateToken } = require('../config/jwt');

const router = express.Router();

router.post('/register', authenticateToken, TaskController.registerTask);
router.put('/updateStatus/:id', authenticateToken, TaskController.updateTaskStatus);
router.put('/update/:id', authenticateToken, TaskController.updateTask); 
router.get('/list', authenticateToken, TaskController.listTask);
router.delete('/delete/:id', authenticateToken, TaskController.deleteTask);
router.get('/index', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;