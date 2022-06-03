const express = require('express');

const { upload } = require('../utils/multer');

const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/usersMiddleware');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validationsMiddlewares');

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/userController');

const router = express.Router();

router.post('/login', login);

router.post('/', upload.single("imgPath"), createUserValidations, checkValidations, createUser);

router.use(protectToken);

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(getUserById)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
