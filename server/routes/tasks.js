const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask, bulkAction } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');

router.use(protect);
router.route('/').get(getTasks).post(createTaskValidator, createTask);
router.post('/bulk', bulkAction);
router.route('/:id').get(getTask).put(updateTaskValidator, updateTask).delete(deleteTask);

module.exports = router;
