const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const getUsers = async (req, res) => {
  res.json({ success: true, users: [] });
};
const getUser = async (req, res) => {
  res.json({ success: true, user: {} });
};
const createUser = async (req, res) => {
  res.status(201).json({ success: true, user: req.body });
};
const updateUser = async (req, res) => {
  res.json({ success: true, user: req.body });
};
const deleteUser = async (req, res) => {
  res.json({ success: true, message: 'User deleted' });
};

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
