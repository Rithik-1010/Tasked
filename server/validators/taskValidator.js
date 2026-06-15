const { body } = require('express-validator');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  body('category').optional().trim(),
  body('tags').optional().isArray(),
  body('notes').optional().trim().isLength({ max: 5000 })
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  body('category').optional().trim(),
  body('tags').optional().isArray(),
  body('notes').optional().trim().isLength({ max: 5000 })
];

module.exports = { createTaskValidator, updateTaskValidator };
