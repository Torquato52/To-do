const express = require('express');
const TaskController = require('../controllers/taskController');
const router = express.Router();

router.post('/register', TaskController.registerTask);
// router.delete('/tasks/:id', TaskController.deleteTask);

module.exports = router;